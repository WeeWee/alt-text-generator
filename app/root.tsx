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
	ThemeProvider,
	useTheme,
} from "remix-themes";
import { themeSessionResolver } from "./services/session.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Toaster } from "./components/ui/toaster";
import { cn } from "./lib/utils";

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
	const [theme] = useTheme();
	return (
		<html lang="en" data-theme={theme ?? ""} className={cn(theme)}>
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
export function ErrorBoundary() {
	const error = useRouteError();
	captureRemixErrorBoundaryError(error);
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>
					{error.status} {error.statusText}
				</h1>
				<p>{error.data}</p>
			</div>
		);
	} else if (error instanceof Error) {
		return (
			<div>
				<h1>Error</h1>
				<p>{error.message}</p>
				<p>The stack trace is:</p>
				<pre>{error.stack}</pre>
			</div>
		);
	} else {
		return <h1>Unknown Error</h1>;
	}
}
