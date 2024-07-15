import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schemas/index";
import { createClient as createTursoClient } from "@tursodatabase/api";
import { migrate } from "drizzle-orm/libsql/migrator";
/* const turso = createTursoClient({
	org: process.env.TURSO_ORG_NAME!,
	token: process.env.TURSO_TOKEN!,
}); */

console.log("TURSO_CONNECTION_URL", process.env.TURSO_CONNECTION_URL);
const client = createClient({
	url: `libsql://${process.env.TURSO_CONNECTION_URL}`,
	authToken: process.env.TURSO_AUTH_TOKEN!,
});
export const db = drizzle(client, {
	schema,
});

/* export const createDatabase = async (dbName: string) => {
	return await turso.databases.create(dbName);
};
export const deleteDatabase = async (dbName: string) => {
	return await turso.databases.delete(dbName);
};
export const workplaceDb = (workplaceId: string) => {
	const workplaceClient = createClient({
		url: `libsql://${workplaceId}-${process.env.TURSO_ORG_NAME!}.turso.io`,
	});

	return drizzle(workplaceClient, { schema });
};
const migrateWorkplaceDb = async (workplaceId: string) => {
	const database = workplaceDb(workplaceId);
	await migrate(database, { migrationsFolder: "./migrations" });
}  */
