import { Navbar } from "~/components/navbar";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUser } from "~/services/auth.server";
import { Outlet, useLoaderData } from "@remix-run/react";
export async function loader({ request, params }: LoaderFunctionArgs) {
	return await requireUser({ request, params });
}
export default function Layout() {
	const user = useLoaderData<typeof loader>();
	return (
		<div>
			<Navbar user={user} />
			<Outlet />
		</div>
	);
}
