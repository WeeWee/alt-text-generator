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
import { Tabs, TabsContent, TabsTrigger } from "~/components/ui/tabs";
import { TabsList } from "@radix-ui/react-tabs";
export async function loader({ request, params }: LoaderFunctionArgs) {
	return await authenticator.isAuthenticated(request, {
		successRedirect: "/account",
	});
}
const strategies = ["google", "github"];

export default function Login() {
	return (
		<div className="flex flex-col items-center justify-center flex-1">
			<Tabs defaultValue={strategies[0]} className="max-w-sm w-full">
				<TabsList className="grid w-full grid-cols-2">
					{strategies.map((strategy) => (
						<TabsTrigger
							key={`${strategy} trigger`}
							value={strategy}
							className="capitalize"
						>
							{strategy}
						</TabsTrigger>
					))}
				</TabsList>
				{strategies.map((strategy, i) => (
					<TabsContent value={strategy} key={`${strategy} content`}>
						<Card>
							<CardHeader>
								<CardTitle className="md:text-2xl text-lg">Login</CardTitle>
								<CardDescription>
									Click the button below to login using{" "}
									<span className="capitalize">{strategy}</span>.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Form action={`/auth/${strategy}`} method="post">
									<Button
										className="w-full"
										variant={i % 2 === 0 ? "default" : "secondary"}
										type="submit"
									>
										Login with{" "}
										<span className="capitalize ml-1">{strategy}</span>
									</Button>
								</Form>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
