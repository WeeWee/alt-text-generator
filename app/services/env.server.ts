import { z, TypeOf } from "zod";
const zodEnv = z.object({
	// GOOGLE OAUTH
	GOOGLE_AUTH_CLIENT_ID: z.string(),
	GOOGLE_AUTH_CLIENT_SECRET: z.string(),
	// GITHUB OAUTH
	GITHUB_AUTH_CLIENT_ID: z.string(),
	GITHUB_AUTH_CLIENT_SECRET: z.string(),

	// TURSO DB CONNECTION
	TURSO_AUTH_TOKEN: z.string(),
	TURSO_ORG_NAME: z.string(),
	TURSO_CONNECTION_URL: z.string(),
	TURSO_ORG_TOKEN: z.string(),
	// SENTRY
	SENTRY_DSN: z.string(),
	SENTRY_AUTH_TOKEN: z.string(),
	SENTRY_ORG: z.string(),
	SENTRY_PROJECT: z.string(),

	// HOST URL
	HOST_URL: z.string(),
});
declare global {
	namespace NodeJS {
		interface ProcessEnv extends TypeOf<typeof zodEnv> {}
	}
}

try {
	zodEnv.parse(process.env);
} catch (err) {
	if (err instanceof z.ZodError) {
		const { fieldErrors } = err.flatten();
		const errorMessage = Object.entries(fieldErrors)
			.map(([field, errors]) =>
				errors ? `${field}: ${errors.join(", ")}` : field
			)
			.join("\n  ");
		throw new Error(`Missing environment variables:\n  ${errorMessage}`);
		process.exit(1);
	}
}
