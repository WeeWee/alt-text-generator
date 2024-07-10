/* import { Storage } from "@google-cloud/storage";
import {
	DownscopedClient,
	GoogleAuth,
	OAuth2Client,
} from "google-auth-library";
export const imageApis = [
	{
		name: "Google Cloud Storage",
		fields: ["Project Id", "Bucket Name"],
		handler: async ({
			ProjectId,
			BucketName,
		}: {
			ProjectId: string;
			BucketName: string;
		}) => {
			const cabRules = {
				accessBoundary: {
					accessBoundaryRules: [
						{
							availableResource: `//storage.googleapis.com/projects/_/buckets/${BucketName}`,
							availablePermissions: ["inRole:roles/storage.objectViewer"],
							availabilityCondition: {
								expression:
									`resource.name.startsWith('projects/_/buckets/` +
									`${BucketName}/objects)`,
							},
						},
					],
				},
			};
			const googleAuth = new GoogleAuth({
				scopes: ["https://www.googleapis.com/auth/cloud-platform"],
			});
			const client = await googleAuth.getClient();
			const cabClient = new DownscopedClient(client, cabRules);
			const oauth2Client = new OAuth2Client();
			oauth2Client.refreshHandler = async () => {
				const refreshedAccessToken = await cabClient.getAccessToken();
				return {
					access_token: refreshedAccessToken.token!,
					expiry_date: refreshedAccessToken.expirationTime!,
				};
			};
			const storageOptions = {
				ProjectId,
				authClient: oauth2Client,
			};
			return new Storage(storageOptions);
		},
	},
];
 */
