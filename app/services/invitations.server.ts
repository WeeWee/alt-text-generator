import { db } from "db";
import { invitations, memberOfWorkplace } from "db/schemas";
import { and, eq } from "drizzle-orm";
import {
	addMemberToManyWorkplaces,
	addWorkplaceMember,
} from "./members.server";

export async function createInvitation(
	workplaceId: string,
	email: string,
	invitedById: string
) {
	return await db
		.insert(invitations)
		.values({ email, workplaceId, invitedById })
		.returning();
}
export type InvitationsReturnType = Awaited<ReturnType<typeof getInvitations>>;
export type InvitationReturnType = InvitationsReturnType extends (infer U)[]
	? U
	: never;
export async function getInvitations(email: string) {
	return await db.query.invitations.findMany({
		where: eq(invitations.email, email),
		with: {
			invitedBy: true,
			workplace: {
				with: {
					owner: true,
				},
			},
		},
	});
}

export async function removeInvitation(workplaceId: string, email: string) {
	return (
		await db
			.delete(invitations)
			.where(
				and(
					eq(invitations.workplaceId, workplaceId),
					eq(invitations.email, email)
				)
			)
	).rowsAffected;
}
export async function removeUserInvitations(email: string) {
	return (await db.delete(invitations).where(eq(invitations.email, email)))
		.rowsAffected;
}
export async function acceptInvitation(
	workplaceId: string,
	email: string,
	userId: string
) {
	await removeInvitation(workplaceId, email);
	return await addWorkplaceMember(workplaceId, userId);
}
export async function acceptUserInvitations(email: string, userId: string) {
	const invitations = await getInvitations(email);
	await removeUserInvitations(email);
	const workplaceIds = invitations.map((invitation) => invitation.workplaceId!);
	return await addMemberToManyWorkplaces(workplaceIds, userId);
}
