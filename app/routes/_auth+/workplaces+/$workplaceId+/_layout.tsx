import { Outlet } from "@remix-run/react";
import { Sidebar } from "~/components/workplace/sidebar";

import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getWorkplaceById, isAdminOrOwner } from "~/services/workplace.server";
import { requireUser } from "~/services/auth.server";
export async function loader({ request, params }: LoaderFunctionArgs) {
	const user = await requireUser({ request, params });
	const workplace = await getWorkplaceById(params.workplaceId!);
	const adminOrOwner = await isAdminOrOwner(workplace!, user?.id!);
	return { workplace, adminOrOwner };
}
export default function Layout() {
	const { workplace, adminOrOwner } = useLoaderData<typeof loader>();
	return (
		<div>
			<Sidebar workplace={workplace!} adminOrOwner={adminOrOwner} />
			<Outlet />
		</div>
	);
}
