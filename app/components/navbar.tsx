import { Form, Link } from "@remix-run/react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserType } from "~/services/user.server";
import { forwardRef } from "react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "./ui/dropdown-menu";
const accountRoutes = [
	{
		name: "Account",
		href: "/account",
	},
	{
		name: "Settings",
		href: "/account/settings",
	},
];
export function Navbar({ user }: { user: UserType }) {
	return (
		<NavigationMenu className="mt-1 *:w-full">
			<NavigationMenuList className="w-full">
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link
							to="/"
							className={cn(
								navigationMenuTriggerStyle(),
								"font-bold leading-normal"
							)}
						>
							ALT Text
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				{user?.memberOfWorkplace && user?.memberOfWorkplace.length > 0 ? (
					<NavigationMenuItem>
						<NavigationMenuTrigger>
							<Link to="/workplaces" className="hover:text-muted-foreground">
								Workplaces
							</Link>
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<ul className="flex flex-col w-64 gap-3 p-4 ">
								{user?.memberOfWorkplace.map(({ workplace }) => (
									<ListItem
										key={workplace.id}
										title={workplace.name}
										to={`/workplaces/${workplace.id}`}
									>
										{workplace.description}
									</ListItem>
								))}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				) : (
					user && (
						<NavigationMenuItem>
							<Link to="/workplaces" className="hover:text-muted-foreground">
								Workplaces
							</Link>
						</NavigationMenuItem>
					)
				)}
				<div className="flex flex-1 items-center justify-end">
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger>
								{" "}
								<Avatar className="w-8 h-8">
									<AvatarImage
										src={user?.picture}
										alt={`Picture of ${user?.name}`}
									/>{" "}
									<AvatarFallback>{user?.name.at(0)}</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="mt-2 w-52">
								<ul className="grid  gap-3 px-2 ">
									{accountRoutes.map((route) => (
										<DropdownMenuItem className="group" key={route.name}>
											<Link
												className="w-full group-hover:text-muted-foreground"
												to={route.href}
											>
												{route.name}
											</Link>
										</DropdownMenuItem>
									))}
									<DropdownMenuSeparator />
									<DropdownMenuItem className="group">
										<Form
											method="post"
											action="/logout"
											className="w-full mb-2"
										>
											<button
												type="submit"
												className="w-full text-start group-hover:text-muted-foreground"
											>
												Logout
											</button>
										</Form>
									</DropdownMenuItem>
								</ul>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button asChild size="sm">
							<Link to="/login">Start now</Link>
						</Button>
					)}
				</div>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = forwardRef<
	React.ElementRef<typeof Link>,
	React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
