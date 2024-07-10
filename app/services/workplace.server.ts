import { db } from "db";
import { memberOfWorkplace, workplaces } from "db/schemas/index";

import { UserType } from "./user.server";
import { inArray } from "drizzle-orm";
import {
	SelectWorkplace,
	InsertWorkplace,
	SelectUser,
	Workplace,
} from "db/types/schemas-types";

export async function isAdminOrOwner(workplace: Workplace, userId: string) {
	return (
		workplace?.owner.id === userId ||
		workplace?.memberOfWorkplaces.find((member) => member.userId === userId)
			?.role === "admin"
	);
}
export async function getWorkplaceById(
	id: SelectWorkplace["id"]
): Promise<Workplace | undefined> {
	return await db.query.workplaces.findFirst({
		with: {
			memberOfWorkplaces: {
				with: {
					user: true,
					workplace: {
						with: {
							owner: true,
						},
					},
				},
			},
			owner: true,
			integrations: true,
			invitations: {
				with: {
					invitedBy: true,
				},
			},
		},
		where: (workplaces, { eq }) => {
			return eq(workplaces.id, id);
		},
	});
}
export async function getWorkplaces({ user }: { user: UserType }) {
	const memberOfWorkplaces = user?.memberOfWorkplace.map(
		(workplace) => workplace.workplaceId
	);

	if (!memberOfWorkplaces || memberOfWorkplaces.length <= 0) {
		return [];
	}

	return await db.query.workplaces.findMany({
		where: inArray(workplaces.id, memberOfWorkplaces),
		with: {
			memberOfWorkplaces: {
				with: {
					user: true,
					workplace: {
						with: {
							owner: true,
						},
					},
				},
			},
			owner: true,
			integrations: true,
			invitations: {
				with: {
					invitedBy: true,
				},
			},
		},
	});
}

export async function createWorkplace(
	data: InsertWorkplace,
	ownerId: SelectUser["id"]
) {
	const workplace = (await db.insert(workplaces).values(data).returning()).at(
		0
	);
	if (workplace) {
		await db
			.insert(memberOfWorkplace)
			.values({ userId: ownerId, workplaceId: workplace?.id });
	}
	return workplace;
}
