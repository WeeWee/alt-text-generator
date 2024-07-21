import { GoogleStrategy } from "remix-auth-google";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { createUser, getUserById } from "./user.server";
import { Params } from "@remix-run/react";
import { SelectUser } from "db/types/schemas-types";
import { GitHubStrategy } from "remix-auth-github";
export const authenticator = new Authenticator<SelectUser["id"] | undefined>(
	sessionStorage
);
const HOST_URL =
	process.env.NODE_ENV === "production"
		? "https://alttext.adamkindberg.com"
		: "http://localhost:3000";

const githubStrategy = new GitHubStrategy(
	{
		clientID: process.env.GITHUB_AUTH_CLIENT_ID!,
		clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET!,
		callbackURL: `${HOST_URL}/auth/github/callback`,
	},
	async ({ accessToken, profile }) => {
		return createUser({
			token: accessToken,
			id: profile.id!,
			email: profile.emails![0].value,
			name: profile.displayName!,
			picture: profile.photos![0].value,
			provider: profile.provider,
			createdAt: new Date().toISOString(),
		});
	}
);
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
			provider: profile.provider,
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
authenticator.use(githubStrategy);
