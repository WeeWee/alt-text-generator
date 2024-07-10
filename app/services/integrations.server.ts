import { v2 as cloudinary } from "cloudinary";
import Imagekit from "imagekit";
import { IntegrationImage } from "~/lib/types/images";
import { CloudinaryImages } from "~/lib/types/cloudinary-images";
import { SelectIntegration } from "db/types/schemas-types";
const availableIntegrations = ["cloudinary", "imagekit"];
export async function getImagesCloudinary({
	cloud_name,
	api_key,
	api_secret,
}: {
	cloud_name: string;
	api_key: string;
	api_secret: string;
}): Promise<IntegrationImage[] | undefined> {
	try {
		cloudinary.config({
			secure: true,
			cloud_name,
			api_key,
			api_secret,
		});
		const images = (await cloudinary.api.resources({
			context: true,
			tags: true,
			resource_type: "image",
			max_results: 30,
		})) as CloudinaryImages;
		images.resources.sort((a, b) => {
			const hasContextA = a.context ? 1 : 0;
			const hasContextB = b.context ? 1 : 0;

			if (hasContextA === hasContextB) {
				if (!a.last_updated || !b.last_updated) {
					return (
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
					);
				}
				return (
					new Date(b.last_updated.updated_at).getTime() -
					new Date(a.last_updated.updated_at).getTime()
				);
			}
			return hasContextB - hasContextA;
		});
		return images.resources.map((image) => ({
			id: image.public_id,
			name: image.filename,
			url: image.url,
			context: image.context,
			tags: image.tags ?? null,
			thumbnail: image.url,
			created_at: new Date(image.created_at),
			updated_at: image.last_updated
				? new Date(image.last_updated.updated_at)
				: new Date(),
			source: "cloudinary",
		}));
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

export async function updateImageCloudinary({
	cloud_name,
	api_key,
	api_secret,
	public_id,
	description,
}: {
	cloud_name: string;
	api_key: string;
	api_secret: string;
	public_id: string;
	description: string;
}) {
	try {
		cloudinary.config({
			url: {
				secure: true,
			},
			cloud_name,
			api_key,
			api_secret,
		});
		return await cloudinary.api.update(public_id, {
			context: `alt=${description}`,
			tags: description,
		});
	} catch (error) {
		console.error(error);
		return undefined;
	}
}
export async function updateImageImagekit({
	endpoint,
	api_key,
	api_secret,
	public_id,
	description,
}: {
	endpoint: string;
	api_key: string;
	api_secret: string;
	public_id: string;
	description: string;
}) {
	try {
		const imagekit = new Imagekit({
			urlEndpoint: endpoint,
			publicKey: api_key,
			privateKey: api_secret,
		});
		/**
		 * customMetadata: {
				alt: description,
			},
		 */
		await imagekit.createCustomMetadataField({
			label: "alt",
			name: "alt",
			schema: {
				type: "Text",
			},
		});

		const updated = await imagekit.updateFileDetails(public_id, {
			tags: [description],
			customMetadata: { alt: description },
		});
		return updated.customMetadata?.alt ? true : false;
	} catch (error) {
		console.error(error);
		return undefined;
	}
}
export async function getImagesImagekit({
	endpoint,
	api_key,
	api_secret,
}: {
	endpoint: string;
	api_key: string;
	api_secret: string;
}): Promise<IntegrationImage[] | undefined> {
	try {
		const imagekit = new Imagekit({
			urlEndpoint: endpoint,
			publicKey: api_key,
			privateKey: api_secret,
		});
		const images = await imagekit.listFiles({ limit: 30, fileType: "image" });

		return images.map((image) => ({
			id: image.fileId,
			name: image.name,
			url: image.url,
			context:
				image.customMetadata && image.customMetadata.alt
					? { custom: { alt: image.customMetadata.alt as string } }
					: null,
			tags: image.tags ?? null,
			thumbnail: image.thumbnail,
			source: "imagekit",
			created_at: new Date(image.createdAt),
			updated_at: new Date(image.updatedAt),
		}));
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

export async function getAllImagesFromIntegrations(
	integrations: SelectIntegration[] | null
): Promise<{ [key: string]: IntegrationImage[] } | null> {
	if (!integrations || integrations.length <= 0) return null;
	const imageResults = await Promise.all(
		integrations.map(async (integration) => {
			if (integration.title === "cloudinary") {
				const images = await getImagesCloudinary({
					cloud_name: integration.endpoint,
					api_key: integration.apiKey,
					api_secret: integration.apiSecret,
				});
				return { cloudinary: images };
			} else if (integration.title === "imagekit") {
				const images = await getImagesImagekit({
					endpoint: integration.endpoint,
					api_key: integration.apiKey,
					api_secret: integration.apiSecret,
				});
				return { imagekit: images };
			}
			return null;
		})
	);

	const allImages: { [key: string]: IntegrationImage[] } = {};
	imageResults.forEach((result) => {
		if (result) {
			const [key, images] = Object.entries(result)[0];
			if (images) {
				allImages[key] = images;
			}
		}
	});

	return allImages;
}
