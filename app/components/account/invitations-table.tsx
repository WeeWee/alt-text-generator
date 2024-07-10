import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Invitations } from "db/types/schemas-types";
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
import { DataTableColumnHeader } from "../table/header";
import dayjs from "dayjs";
import { Form } from "@remix-run/react";
import {
	InvitationReturnType,
	InvitationsReturnType,
} from "~/services/invitations.server";
const columns: ColumnDef<InvitationReturnType>[] = [
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
		id: "Workplace name",
		accessorFn: (row) => row.workplace?.name,
		accessorKey: "Workplace name",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Workplace name" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("Workplace name")}</div>
		),
	},
	{
		id: "Owner",
		accessorKey: "Owner",
		accessorFn: (row) => row.workplace?.owner.name,
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Owner" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("Owner")}</div>
		),
	},
	{
		id: "Invited By",
		accessorFn: (row) => row.invitedBy?.name,
		accessorKey: "Invited By",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Invited by" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("Invited By")}</div>
		),
	},
	{
		id: "Invited at",
		accessorFn: (row) => row.createdAt,
		accessorKey: "Invited at",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Invited at" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">
				{dayjs(row.getValue("Invited at")).format("DD/MM/YYYY ")}
			</div>
		),
	},

	{
		id: "actions",
		enableHiding: false,
		header: ({ table }) => {
			if (!table.getIsAllPageRowsSelected()) return null;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="  h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="">
							<Form method="post">
								<button name="_action" value="accept_all_invitations">
									Join all workplaces
								</button>
							</Form>
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive focus:bg-destructive">
							<Form method="post">
								<button name="_action" value="decline_all_invitations">
									Decline all invites
								</button>
							</Form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="  h-8 w-8 p-0">
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
									name="workplace_id"
									value={row.original.workplaceId!}
								/>
								<input type="hidden" name="email" value={row.original.email} />
								<button name="_action" value="accept_invite">
									Join workplace
								</button>
							</Form>
						</DropdownMenuItem>
						<DropdownMenuItem className="text-destructive focus:bg-destructive">
							<Form method="post">
								<input
									type="hidden"
									name="workplace_id"
									value={row.original.workplaceId!}
								/>
								<input type="hidden" name="email" value={row.original.email} />
								<button name="_action" value="decline_invite">
									Decline invite
								</button>
							</Form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
export function AccountInvitationsTable({
	invitations,
}: {
	invitations: InvitationsReturnType;
}) {
	return <DataTable columns={columns} data={invitations} />;
}
