import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "~/components/ui/table";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Invitations, SelectInvitation } from "db/types/schemas-types";
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
const columns: ColumnDef<SelectInvitation>[] = [
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
		id: "Email",
		accessorFn: (row) => row.email,
		accessorKey: "Email",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Email" />;
		},
		cell: ({ row }) => <div className="lowercase">{row.getValue("Email")}</div>,
	},
	{
		id: "Invited by",
		accessorFn: (row) => row.invitedBy?.name,
		accessorKey: "Invited by",
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Invited by" />;
		},
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("Invited by")}</div>
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
			<div className="lowercase">
				{dayjs(row.getValue("Invited at")).format("DD/MM/YYYY ")}
			</div>
		),
	},

	{
		id: "actions",
		enableHiding: false,
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
						<DropdownMenuItem className="text-destructive focus:bg-destructive">
							<Form method="post">
								<input
									type="hidden"
									name="workplace_id"
									value={row.original.workplaceId!}
								/>
								<input type="hidden" name="email" value={row.original.email} />
								<button name="_action" value="remove_invite">
									Remove invite
								</button>
							</Form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
export function InvitationsTable({
	invitations,
}: {
	invitations: Invitations;
}) {
	return <DataTable columns={columns} data={invitations} />;
}
