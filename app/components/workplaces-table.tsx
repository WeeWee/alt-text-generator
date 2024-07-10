import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import dayjs from "dayjs";
import { Link } from "@remix-run/react";
import { Workplaces } from "db/types/schemas-types";

export function WorkplacesTable({ workplaces }: { workplaces: Workplaces }) {
	return (
		<Table>
			<TableCaption>A list of your workplaces.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Owner</TableHead>
					<TableHead className="text-right">Created at</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{workplaces?.map((workplace) => (
					<TableRow key={workplace.id}>
						<TableCell className=" hover:text-muted-foreground">
							<Link to={`/workplaces/${workplace.id}`}>{workplace.name}</Link>
						</TableCell>
						<TableCell className="capitalize">{workplace.owner.name}</TableCell>
						<TableCell className="text-right">
							{dayjs(workplace.createdAt).format("DD/MM/YYYY")}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

/**
 * <TableCell className="font-medium">
							<Link to={`/workplaces/${workplace.id}`}>{workplace.id}</Link>
						</TableCell>
 */
