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
import {
	generateDescription,
	generateDescriptionBatch,
} from "~/services/ai.server";
import {
	getAllImagesFromIntegrations,
	updateImageCloudinary,
	updateImageImagekit,
} from "~/services/integrations.server";
import { requireUser } from "~/services/auth.server";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
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
		const images: { id: string; url: string; integration: string }[] | null =
			formData?.get("images")
				? JSON.parse(formData.get("images") as string)
				: null;

		if (images) {
			const descriptions = await generateDescriptionBatch(
				images.map((image) => image.url)
			);
			workplace?.integrations.map(async (integration) => {
				if (descriptions.length <= 0) return;
				descriptions.map(async (description, index) => {
					if (integration.title !== images[index].integration) return;
					if (!description) return;
					if (images[index].integration === "cloudinary")
						await updateImageCloudinary({
							cloud_name: integration.endpoint,
							api_key: integration.apiKey,
							api_secret: integration.apiSecret,
							public_id: images[index].id,
							description,
						});
					if (images[index].integration === "imagekit")
						await updateImageImagekit({
							api_key: integration.apiKey,
							api_secret: integration.apiSecret,
							endpoint: integration.endpoint,
							description,
							public_id: images[index].id,
						});
				});
			});
		} else {
			const description = await generateDescription(image_url);
			workplace?.integrations.map(async (integration) => {
				if (integration.title !== current_integration) return;
				if (!description) return;
				if (current_integration === "cloudinary")
					await updateImageCloudinary({
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
		return null;
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

	const [selectedImages, setSelectedImages] = useState(
		images
			? Object.entries(images).map(([key, images]) =>
					images.map((image) => ({
						id: image.id,
						url: image.url,
						hasDescription: image.context
							? true
							: image.tags && image.tags.length > 0
							? true
							: false,
						selected: false,
						integration: key,
					}))
			  )
			: undefined
	);
	const [selectedAll, setSelectAll] = useState(false);

	const handleSelectAllEmpty = (value: boolean) => {
		setSelectedImages((integration) =>
			integration?.map((images) =>
				images
					.filter((image) => image.hasDescription === false)
					.map((image) => ({ ...image, selected: value }))
			)
		);
		setSelectAll(value);
	};
	const handleSelectImage = (id: string, value: boolean) => {
		setSelectedImages((integration) =>
			integration?.map((images) =>
				images.map((image) =>
					image.id === id ? { ...image, selected: value } : image
				)
			)
		);
	};
	const getSelectedImages = () => {
		if (!selectedImages) return [];
		const flattenedImages = selectedImages.flat();
		return flattenedImages.filter(({ selected }) => selected);
	};

	return (
		<div>
			{images ? (
				Object.entries(images).map(([key, images], index) => (
					<div key={key}>
						<h4 className="font-bold text-2xl leading-normal mt-8 capitalize">
							{key}
						</h4>

						<section className="flex items-center justify-end gap-8">
							<div className="flex items-center gap-4 text-sm">
								<p>Select all empty</p>
								<Checkbox
									aria-label="Select all empty images"
									onCheckedChange={(value) => handleSelectAllEmpty(!!value)}
									checked={selectedAll}
								/>
							</div>

							{getSelectedImages().length > 0 && (
								<Form
									method="post"
									className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-10"
								>
									<input
										type="hidden"
										name="images"
										value={JSON.stringify(getSelectedImages())}
									/>
									<Button
										type="submit"
										disabled={submitting}
										name="_action"
										value="generate"
										className=" text-sm md:text-base "
										size="sm"
									>
										Generate {getSelectedImages().length} description (s)
									</Button>
								</Form>
							)}
						</section>
						<div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-4 gap-4 md:gap-8">
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
											<div className="flex justify-between items-center">
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
												{!image.context && (
													<Checkbox
														disabled={submitting}
														checked={
															selectedImages
																? selectedImages[index]?.find(
																		({ id }) => image.id === id
																  )?.selected
																: false
														}
														onCheckedChange={(value) =>
															handleSelectImage(image.id, !!value)
														}
														aria-label="Select image"
													/>
												)}
											</div>
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
