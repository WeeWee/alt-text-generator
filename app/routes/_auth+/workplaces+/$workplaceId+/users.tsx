import type { LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { UsersTable } from "~/components/workplace/usersTable";
import { getWorkplaceById, isAdminOrOwner } from "~/services/workplace.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import InvitationForm from "~/components/workplace/invitation-form";
import { parseWithZod } from "@conform-to/zod";
import {
	createInvitation,
	removeInvitation,
} from "~/services/invitations.server";
import { InvitationsTable } from "~/components/workplace/invitations-table";
import { requireUser } from "~/services/auth.server";
import {
	removeWorkplaceMember,
	updateWorkplaceMember,
} from "~/services/members.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const user = await requireUser({ request, params });
	const workplace = await getWorkplaceById(params.workplaceId!);
	const adminOrOwner = await isAdminOrOwner(workplace!, user?.id!);
	return { workplace, user, adminOrOwner };
}
export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const _action = formData.get("_action");
	const workplaceId = params.workplaceId!;
	if (_action === "update_permissions") {
		const userId = formData.get("user_id") as string;
		const role = formData.get("role") as "admin" | "member";

		return await updateWorkplaceMember(
			workplaceId,
			userId,
			role === "admin" ? "member" : "admin"
		);
	}
	if (_action === "remove_user") {
		const userId = formData.get("user_id") as string;
		return await removeWorkplaceMember(workplaceId, userId);
	}
	if (_action === "remove_invite") {
		const email = formData.get("email") as string;
		return await removeInvitation(workplaceId, email);
	}
	if (_action === "create_invitation") {
		const user = await requireUser({ request, params });
		const submission = parseWithZod(formData, {
			schema: insertInvitationSchema,
		});
		if (submission.status !== "success") {
			return submission.reply();
		}
		await createInvitation(workplaceId, submission.value.email, user?.id!);
		return submission.reply({ resetForm: true });
	}
	return null;
}
export const insertInvitationSchema = z.object({
	email: z.string().email(),
	workplaceId: z.string(),
});
export default function Users() {
	const { workplace, adminOrOwner } = useLoaderData<typeof loader>();
	const lastResult = useActionData<typeof action>();

	return (
		<div>
			<h1 className="md:text-2xl text-lg font-bold leading-normal mt-4">
				Users
			</h1>
			<UsersTable
				adminOrOwner={adminOrOwner}
				memberOfWorkplaces={workplace?.memberOfWorkplaces!}
			/>
			<h3 className="md:text-2xl mb-4 mt-8 text-lg font-bold leading-normal">
				Invitations
			</h3>
			<div>
				<InvitationsTable invitations={workplace?.invitations!} />
			</div>
			{adminOrOwner && (
				<>
					<h2 className="md:text-2xl text-lg font-bold leading-normal mt-4">
						Invite users
					</h2>
					<InvitationForm
						workplaceId={workplace?.id!}
						lastResult={lastResult}
					/>
				</>
			)}
		</div>
	);
}
