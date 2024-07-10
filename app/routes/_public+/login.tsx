import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator, requireUser } from "~/services/auth.server";
export async function loader({ request, params }: LoaderFunctionArgs) {
	return await authenticator.isAuthenticated(request, {
		successRedirect: "/account",
	});
}
export default function Login() {
	return (
		<div className="flex flex-col items-center justify-center flex-1">
			<Card className="max-w-sm w-full">
				<CardHeader>
					<CardTitle className="md:text-2xl text-lg">Login</CardTitle>
					<CardDescription>Click the button below to login.</CardDescription>
				</CardHeader>
				<CardContent>
					<Form action="/auth/google" method="post">
						<Button className="w-full" type="submit">
							Login with Google
						</Button>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
