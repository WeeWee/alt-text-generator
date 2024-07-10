import { Link, useLocation, useNavigation } from "@remix-run/react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Home, Settings, Users2, Workflow } from "lucide-react";
import { SelectWorkplace } from "db/types/schemas-types";
import { cn } from "~/lib/utils";

export function Sidebar({
	workplace,
	adminOrOwner,
}: {
	workplace: SelectWorkplace;
	adminOrOwner: boolean;
}) {
	const location = useLocation();

	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to={`/workplaces/${workplace.id}`}
								className={cn(
									"group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full hover:bg-primary bg-muted text-foreground text-lg font-semibold hover:text-primary-foreground md:h-8 md:w-8 md:text-base",
									location?.pathname === `/workplaces/${workplace.id}`
										? "bg-primary text-primary-foreground"
										: "text-muted-foreground"
								)}
							>
								<Workflow className="h-4 w-4 transition-all group-hover:scale-110" />
								<span className="sr-only">{workplace.name}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Dashboard</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to={`/workplaces/${workplace.id}/users`}
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8",
									location?.pathname === `/workplaces/${workplace.id}/users`
										? "text-foreground"
										: "text-muted-foreground"
								)}
							>
								<Users2 className="h-5 w-5" />
								<span className="sr-only">Users</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Users</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</nav>
			{adminOrOwner && (
				<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									to="settings"
									className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
								>
									<Settings className="h-5 w-5" />
									<span className="sr-only">Settings</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Settings</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</nav>
			)}
		</aside>
	);
}
