import { db } from "db";
import { users } from "db/schemas/index";
import { InsertUser, SelectUser } from "db/types/schemas-types";
import { eq } from "drizzle-orm";

export async function createUser(data: InsertUser) {
	const user = (
		await db
			.insert(users)
			.values(data)
			.onConflictDoUpdate({
				target: users.email,
				set: { email: data.email },
			})
			.returning()
	).at(0);
	
	return user?.id;
}
export type UserType = Awaited<ReturnType<typeof getUserById>>;
export async function getUserById(id: SelectUser["id"]) {
	if (!id) return null;
	return await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, id),
		with: {
			ownerOfWorkplace: true,
			memberOfWorkplace: {
				with: {
					workplace: {
						with: {
							owner: true,
						},
					},
				},
			},
		},
	});
}

export async function getUserByToken(token: SelectUser["token"]) {
	return (await db.select().from(users).where(eq(users.token, token))).at(0);
}

export async function updateUser(
	id: SelectUser["id"],
	name: InsertUser["name"],
	picture: InsertUser["picture"]
) {
	return await db
		.update(users)
		.set({ name, picture })
		.where(eq(users.id, id))
		.returning();
}
