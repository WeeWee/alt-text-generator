import { db } from "db";
import { integrations } from "db/schemas";
import { InsertIntegration } from "db/types/schemas-types";

export async function updateIntegrationKeys({
	endpoint,
	apiKey,
	apiSecret,
	title,
}: InsertIntegration) {
	return await db.update(integrations).set({
		endpoint,
		apiKey,
		apiSecret,
		title,
	});
}
export async function createIntegration({
	endpoint,
	apiKey,
	apiSecret,
	title,
	workplaceId,
}: InsertIntegration) {
	if (!endpoint || !apiKey || !apiSecret) return null;
	return await db
		.insert(integrations)
		.values({ endpoint, apiKey, apiSecret, title, workplaceId })
		.returning();
}
