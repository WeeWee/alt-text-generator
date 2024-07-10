import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MemberOfWorkplace, MemberOfWorkplaces } from "db/types/schemas-types";
import { Checkbox } from "../ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { DataTable } from "../table/table";
import { Form } from "@remix-run/react";
const columns: (adminOrOwner: boolean) => ColumnDef<MemberOfWorkplace>[] = (
	adminOrOwner: boolean
) => [
	{
		id: "select",

		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		id: "name",
		accessorKey: "name",
		accessorFn: (row) => row.user.name,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
	},
	{
		id: "email",
		accessorKey: "email",
		accessorFn: (row) => row.user.email,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
	},
	{
		id: "role",
		accessorKey: "role",
		accessorFn: (row) =>
			row.workplace.owner.id === row.userId ? "owner" : row.role,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Role
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("role")}</div>,
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			if (row.original.workplace.owner.id === row.original.userId) return null;
			if (!adminOrOwner) return null;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />

						<DropdownMenuItem className="">
							<Form method="post">
								<input
									type="hidden"
									name="user_id"
									value={row.original.userId}
								/>

								<input type="hidden" name="role" value={row.original.role} />
								<button name="_action" value="update_permissions">
									{row.original.role === "admin" ? "Set member" : "Set admin"}
								</button>
							</Form>
						</DropdownMenuItem>

						<DropdownMenuItem className=" text-destructive focus:bg-destructive">
							<Form method="post">
								<input type="hidden" name="email" value={row.original.userId} />
								<button name="_action" value="remove_user">
									Remove user
								</button>
							</Form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
export function UsersTable({
	memberOfWorkplaces,
	adminOrOwner,
}: {
	memberOfWorkplaces: MemberOfWorkplaces;
	adminOrOwner: boolean;
}) {
	return (
		<DataTable columns={columns(adminOrOwner)} data={memberOfWorkplaces} />
	);
}
