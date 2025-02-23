import { createCookieSessionStorage } from "@remix-run/node";

const isProduction = process.env.NODE_ENV === "production";
export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "_session",
		sameSite: "lax",
		path: "/",
		httpOnly: true,
		secrets: [process.env.SESSION_SECRET_KEY!],
		secure: isProduction,
	},
});

import { createThemeSessionResolver } from "remix-themes";

const themeSessionStorage = createCookieSessionStorage({
	cookie: {
		name: "theme",
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secrets: [process.env.THEME_SESSION_SECRET_KEY!],
		// Set domain and secure only if in production
		...(isProduction ? { domain: process.env.HOST_URL, secure: true } : {}),
	},
});

export const themeSessionResolver =
	createThemeSessionResolver(themeSessionStorage);
export const { getSession, commitSession, destroySession } = sessionStorage;
