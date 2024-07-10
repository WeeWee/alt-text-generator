import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/navbar";

import { requireUser } from "~/services/auth.server";
export async function loader({ request, params }: LoaderFunctionArgs) {
	const user = await requireUser({ request, params, redirect: false });
	console.log(user);
	return user;
}
export default function Layout() {
	const user = useLoaderData<typeof loader>();
	return (
		<>
			<Navbar user={user} />
			<Outlet />
		</>
	);
}
