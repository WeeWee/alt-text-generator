import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs } from "@remix-run/node";
import { json, useActionData, useLoaderData } from "@remix-run/react";
import { createIntegration } from "~/services/integration-db.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getWorkplaceById } from "~/services/workplace.server";
import { schema, SettingsForm } from "~/components/workplace/settingsForm";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Button } from "~/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parseWithZod(formData, { schema });
	const integrationTitle = formData.get("title") as string;
	if (submission.status !== "success") {
		console.error(submission.error);
		return json({ [integrationTitle]: submission.reply() });
	}
	await createIntegration(submission.value);

	return json({ [integrationTitle]: submission.reply({ resetForm: true }) });
}
export async function loader({ request, params }: LoaderFunctionArgs) {
	const workplace = await getWorkplaceById(params.workplaceId!);

	return workplace;
}
const integrations = [
	{
		title: "cloudinary",
		description: `
		<pre>
			<code>context: &#123;
			 	custom: &#123;
			 		 alt: string
				&#125;
			&#125;&#59;</code>
		</pre>
		`,
	},
	{
		title: "imagekit",
		description: `
		<pre>
			<code>customMetadata: &#123;
			 	alt: string
			&#125;&#59;</code>
		</pre>
		`,
	},
];
export default function Settings() {
	const lastResult = useActionData<typeof action>();
	const workplace = useLoaderData<typeof loader>();
	return (
		<div>
			<div className="grid md:grid-flow-col grid-rows-1 md:grid-rows-2 gap-8">
				{integrations.map((integration) => (
					<>
						<SettingsForm
							workplaceId={workplace.id}
							key={integration.title}
							lastResult={lastResult?.[integration.title]}
							title={integration.title}
						/>
						<Collapsible
							key={`${integration.title} description`}
							className="pb-4 max-w-xs"
						>
							<div className="flex items-center justify-between gap-4 px-4">
								<h4 className="text-sm font-bold">
									How do i access the ALT text?
								</h4>
								<CollapsibleTrigger asChild>
									<Button variant="ghost" size="sm" className="w-9 p-0">
										<ChevronsUpDown className="h-4 w-4" />
										<span className="sr-only">Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent>
								<div className="px-4">
									<div className="text-sm">
										Access the ALT tag with{" "}
										<span className="capitalize">{integration.title} </span> API
										using:
										<div
											dangerouslySetInnerHTML={{
												__html: integration.description,
											}}
										></div>
										<p className="font-bold leading-normal">OR</p>
										<pre>
											<code> tags: string[]&#59;</code>
										</pre>
									</div>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</>
				))}
			</div>
		</div>
	);
}
