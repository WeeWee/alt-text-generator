import { db } from "db";
import { memberOfWorkplace } from "db/schemas";
import { and, eq } from "drizzle-orm";

export async function updateWorkplaceMember(
	workplaceId: string,
	userId: string,
	role: "admin" | "member"
) {
	return await db
		.update(memberOfWorkplace)
		.set({ role })
		.where(
			and(
				eq(memberOfWorkplace.workplaceId, workplaceId),
				eq(memberOfWorkplace.userId, userId)
			)
		)
		.returning();
}

export async function removeWorkplaceMember(
	workplaceId: string,
	userId: string
) {
	return (
		await db
			.delete(memberOfWorkplace)
			.where(
				and(
					eq(memberOfWorkplace.workplaceId, workplaceId),
					eq(memberOfWorkplace.userId, userId)
				)
			)
	).rowsAffected;
}

export async function addWorkplaceMember(workplaceId: string, userId: string) {
	return (
		await db.insert(memberOfWorkplace).values({
			workplaceId,
			userId,
		})
	).rowsAffected;
}

export async function addMemberToManyWorkplaces(
	workplaceIds: string[],
	userId: string
) {
	return (
		await db
			.insert(memberOfWorkplace)
			.values(workplaceIds.map((workplaceId) => ({ workplaceId, userId })))
	).rowsAffected;
}
