import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas/index";

const client = createClient({
	url: process.env.TURSO_CONNECTION_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!,
});
export const db = drizzle(client, {
	schema,
});

export const workplaceDb = (workplaceId: string) => {
	const workplaceClient = createClient({
		url: `http://${workplaceId}.${process.env.TURSO_CONNECTION_URL}`,
	});

	return drizzle(workplaceClient, { schema });
};
