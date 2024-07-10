import {
	Form,
	json,
	Link,
	useLoaderData,
	useNavigation,
} from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { getWorkplaceById, isAdminOrOwner } from "~/services/workplace.server";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { generateDescription } from "~/services/ai.server";
import {
	getAllImagesFromIntegrations,
	updateImageCloudinary,
	updateImageImagekit,
} from "~/services/integrations.server";
import { requireUser } from "~/services/auth.server";
export async function loader({ request, params }: LoaderFunctionArgs) {
	const user = await requireUser({ request, params });
	const workplace = await getWorkplaceById(params.workplaceId!);
	const images = await getAllImagesFromIntegrations(
		workplace?.integrations ?? null
	);
	const adminOrOwner = await isAdminOrOwner(workplace!, user?.id!);
	return { images, adminOrOwner };
}
export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await request.formData();
	const _action = formData.get("_action");
	const workplace = await getWorkplaceById(params.workplaceId!);
	if (_action === "generate") {
		const public_id = formData.get("public_id") as string;
		const image_url = formData.get("image_url") as string;
		const current_integration = formData.get("integration") as string;
		const description = await generateDescription(image_url);
		workplace?.integrations.map(async (integration) => {
			if (integration.title !== current_integration) return;
			if (!description) return;
			if (current_integration === "cloudinary")
				updateImageCloudinary({
					cloud_name: integration.endpoint,
					api_key: integration.apiKey,
					api_secret: integration.apiSecret,
					public_id,
					description,
				});
			if (current_integration === "imagekit")
				await updateImageImagekit({
					api_key: integration.apiKey,
					api_secret: integration.apiSecret,
					endpoint: integration.endpoint,
					description,
					public_id,
				});
		});
		return json(description);
	}
	if (_action === "update") {
		const description = formData.get("description") as string;
		const public_id = formData.get("public_id") as string;
		const current_integration = formData.get("integration") as string;
		workplace?.integrations.map(async (integration) => {
			if (integration.title !== current_integration) return;
			if (!description) return null;
			if (current_integration === "cloudinary") {
				await updateImageCloudinary({
					cloud_name: integration.endpoint,
					api_key: integration.apiKey,
					api_secret: integration.apiSecret,
					public_id,
					description,
				});
			}
			if (current_integration === "imagekit") {
				await updateImageImagekit({
					api_key: integration.apiKey,
					api_secret: integration.apiSecret,
					endpoint: integration.endpoint,
					description,
					public_id,
				});
			}
		});
		return json(description);
	}
	return null;
}
export default function Workplace() {
	const { images, adminOrOwner } = useLoaderData<typeof loader>();
	const { state, formData } = useNavigation();
	const submitting = state === "submitting";
	const image_url = formData?.get("image_url");

	return (
		<div>
			{images ? (
				Object.entries(images).map(([key, images]) => (
					<div key={key}>
						<h4 className="font-bold text-2xl leading-normal mt-8 capitalize">
							{key}
						</h4>
						<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-4 gap-4 md:gap-8">
							{images?.map((image) => (
								<div
									key={image.id}
									className="rounded-md border overflow-hidden flex flex-col"
								>
									<img
										className="w-full flex-1 max-h-52 object-cover"
										alt={image.name}
										src={image.url}
									/>
									<div className="p-4 ">
										<Form method="post" className="space-y-4">
											<input type="hidden" value={image.id} name="public_id" />
											<input type="hidden" value={image.url} name="image_url" />
											<input
												type="hidden"
												value={image.source}
												name="integration"
											/>
											<Input
												errors={undefined}
												description="ALT text"
												placeholder="Generated ALT text will appear here"
												aria-label="ALT text"
												name="description"
												defaultValue={
													image.context ? image.context.custom.alt : ""
												}
												disabled={!image.context}
											/>
											<Button
												variant={image.context ? "secondary" : "default"}
												disabled={submitting && image_url === image.url}
												type="submit"
												name="_action"
												value={image.context ? "update" : "generate"}
											>
												{submitting && image_url === image.url
													? image.context
														? "Updating..."
														: "Generating..."
													: image.context
													? "Change"
													: "Generate"}
											</Button>
										</Form>
									</div>
								</div>
							))}
						</div>
					</div>
				))
			) : adminOrOwner ? (
				<div className="flex flex-col items-center justify-center">
					<div>
						<h4 className="font-bold text-2xl leading-normal mt-8">
							No integration setup
						</h4>
						<p className="text-muted-foreground text-xs">
							Check settings to integrate your image hosting
						</p>
					</div>
					<Button asChild className="mt-4">
						<Link to="settings">Settings</Link>
					</Button>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center text-center">
					<div>
						<h4 className="font-bold text-2xl leading-normal mt-8">
							No integration setup
						</h4>
						<p className="text-muted-foreground text-xs">
							Only the owner or admins can integrate image hosting
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
