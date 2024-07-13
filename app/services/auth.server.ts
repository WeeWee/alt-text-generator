import { GoogleStrategy } from "remix-auth-google";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { createUser, getUserById } from "./user.server";
import { Params } from "@remix-run/react";
import { SelectUser } from "db/types/schemas-types";

export const authenticator = new Authenticator<SelectUser["id"] | undefined>(
	sessionStorage
);
const HOST_URL =
	process.env.NODE_ENV === "production"
		? process.env.HOST_URL!
		: "http://localhost:3000";
const googleStrategy = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_AUTH_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
		callbackURL: `${HOST_URL}/auth/google/callback`,
	},
	async ({ accessToken, profile }) => {
		return createUser({
			token: accessToken,
			id: profile.id!,
			email: profile.emails![0].value,
			name: profile.displayName!,
			picture: profile.photos![0].value,
			provider: "google",
			createdAt: new Date().toISOString(),
		});
	}
);
export async function requireUser({
	request,
	params,
	redirect = true,
}: {
	request: Request;
	params: Params;
	redirect?: boolean;
}) {
	const userId = redirect
		? await authenticator.isAuthenticated(request, {
				failureRedirect: "/login",
		  })
		: await authenticator.isAuthenticated(request);
	const user = await getUserById(userId!);

	if (!user && userId) {
		return await authenticator.logout(request, { redirectTo: "/login" });
	}

	return user ?? null;
}
authenticator.use(googleStrategy);
