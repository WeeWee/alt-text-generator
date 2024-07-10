import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { WorkplacesTable } from "~/components/workplaces-table";
import { authenticator, requireUser } from "~/services/auth.server";

import { CreateWorkplaceForm } from "~/components/create-workplace-form";
import { DrawerDialog } from "~/components/dialog";

import { parseWithZod } from "@conform-to/zod";
import { insertWorkplaceSchema } from "db/schemas/index";
import { createWorkplace, getWorkplaces } from "~/services/workplace.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const user = await requireUser({ request, params });
	const workplaces = await getWorkplaces({ user });
	return { user,workplaces };
}

export async function action({ request }: ActionFunctionArgs) {
	const userId = await authenticator.isAuthenticated(request);
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema: insertWorkplaceSchema });
	if (submission.status !== "success") {
		return json(submission.reply());
	}
	await createWorkplace(
		{
			id: submission.value.id!,
			name: submission.value.name,
			description: submission.value.description,
			owner: submission.value.owner!,
			createdAt: new Date().toISOString(),
			updateAt: new Date().toISOString(),
		},
		userId!
	);
	return json(submission.reply({ resetForm: true }));
}
export default function Workplaces() {
	const { user,workplaces } = useLoaderData<typeof loader>();
	const lastResult = useActionData();
	return (
		<div className="flex flex-col gap-4">
			<section className="">
				<h1 className="font-bold text-lg leading-normal">
					Want to create a new workplace?
				</h1>
				<DrawerDialog
					buttonText="Create workplace"
					description="Create a new workplace"
					title="Create workplace"
				>
					<CreateWorkplaceForm lastResult={lastResult} ownerId={user?.id!} />
				</DrawerDialog>
			</section>
			<h2 className="font-bold text-lg leading-normal">Your Workplaces</h2>
			<WorkplacesTable workplaces={workplaces} />
		</div>
	);
}
