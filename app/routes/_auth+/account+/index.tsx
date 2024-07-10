import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/auth.server";
import { Separator } from "~/components/ui/separator";
import dayjs from "dayjs";
import { AccountSheet } from "~/components/account/account-sheet";
import z from "zod";
import type { ActionFunctionArgs } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { updateUser } from "~/services/user.server";
import {
	acceptInvitation,
	acceptUserInvitations,
	getInvitations,
	removeInvitation,
	removeUserInvitations,
} from "~/services/invitations.server";
import { AccountInvitationsTable } from "~/components/account/invitations-table";
export const updateUserSchema = z.object({
	name: z.string().min(3).max(32),
	picture: z.string().url("Invalid URL"),
});
export async function loader({ request, params }: LoaderFunctionArgs) {
	const user = await requireUser({ request, params });
	const invitations = await getInvitations(user?.email!);
	return { user, invitations };
}
export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const _action = formData.get("_action");
	const user = await requireUser({ request, params });
	if (_action === "update_user") {
		const submission = parseWithZod(formData, { schema: updateUserSchema });
		if (submission.status !== "success") {
			console.error(submission.error);
			return json(submission.reply());
		}
		await updateUser(
			user?.id!,
			submission.value.name,
			submission.value.picture
		);
		return json(submission.reply({ resetForm: true }));
	}
	if (_action === "accept_invite") {
		const workplaceId = formData.get("workplace_id") as string;

		return await acceptInvitation(workplaceId, user?.email!, user?.id!);
	}
	if (_action === "decline_invite") {
		const workplaceId = formData.get("workplace_id") as string;
		return await removeInvitation(workplaceId, user?.email!);
	}
	if (_action === "decline_all_invitations") {
		return await removeUserInvitations(user?.email!);
	}
	if (_action === "accept_all_invitations") {
		return await acceptUserInvitations(user?.email!, user?.id!);
	}
	return null;
}
export default function Account() {
	const lastResult = useActionData<typeof action>();
	const { user, invitations } = useLoaderData<typeof loader>();
	return (
		<div className="flex flex-col gap-12">
			<section className="">
				<h1 className="font-bold text-xl md:text-3xl mb-2">Account</h1>
				<section className="flex gap-4 items-center">
					<h2 className=" capitalize font-bold">{user?.name}</h2>
				</section>
				<p className="text-sm text-muted-foreground">{user?.email}</p>
				<p className="text-sm text-muted-foreground">
					Created {dayjs().format("DD/MM/YYYY")}
				</p>
				<p className="text-sm text-muted-foreground capitalize">
					{user?.provider}
				</p>
				<div>
					<AccountSheet user={user} lastResult={lastResult} />
				</div>
			</section>
			<Separator />
			<section>
				<h2 className="font-bold text-xl leading-normal ">Invitations</h2>
				<div>
					<AccountInvitationsTable invitations={invitations} />
				</div>
			</section>
		</div>
	);
}
