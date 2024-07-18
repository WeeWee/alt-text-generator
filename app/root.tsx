import { captureRemixErrorBoundaryError, withSentry } from "@sentry/remix";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
import "./tailwind.css";
import {
	PreventFlashOnWrongTheme,
	Theme,
	ThemeProvider,
	useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./services/session.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Toaster } from "./components/ui/toaster";
import { cn } from "./lib/utils";
import { useEffect } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
	const { getTheme } = await themeSessionResolver(request);
	const SENTRY_DSN = process.env.SENTRY_DSN!;
	return {
		theme: getTheme(),
		ENV: { SENTRY_DSN },
	};
}

function AppWithProviders() {
	const data = useLoaderData<typeof loader>();

	return (
		<ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
			<App />
		</ThemeProvider>
	);
}
declare global {
	interface Window {
		ENV: {
			SENTRY_DSN: string;
		};
	}
}
export default withSentry(AppWithProviders);
function App() {
	const data = useLoaderData<typeof loader>();
	const [theme, setTheme] = useTheme();
	useEffect(() => {
		if (window != undefined && !theme)
			setTheme(
				window.matchMedia("(prefers-color-scheme: dark)").matches
					? Theme.DARK
					: Theme.LIGHT
			);
	}, []);
	return (
		<html lang="en" className={cn(theme)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
				<Links />
			</head>
			<body className="   ">
				<div className="container min-h-screen flex flex-col">
					<Outlet />
					<Toaster />
					<ScrollRestoration />
					<script
						dangerouslySetInnerHTML={{
							__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
						}}
					/>
					<Scripts />
				</div>
			</body>
		</html>
	);
}
