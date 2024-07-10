import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { useMediaQuery } from "~/lib/hooks/useMediaQuery";
import { ClientOnly } from "remix-utils/client-only";
export function DrawerDialog({
	buttonText,
	title,
	description,
	children,
}: {
	buttonText: string;
	title: string;
	description: string;
	children: JSX.Element;
}) {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<ClientOnly fallback={<></>}>
				{() => (
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant="outline">{buttonText}</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>{title}</DialogTitle>
								<DialogDescription>{description}</DialogDescription>
							</DialogHeader>
							{children}
						</DialogContent>
					</Dialog>
				)}
			</ClientOnly>
		);
	}

	return (
		<ClientOnly fallback={<></>}>
			{() => (
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<Button variant="outline">{buttonText}</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader className="text-left">
							<DrawerTitle>{title}</DrawerTitle>
							<DrawerDescription>{description}</DrawerDescription>
						</DrawerHeader>
						{children}
						<DrawerFooter className="pt-2">
							<DrawerClose asChild>
								<Button variant="outline">Cancel</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</ClientOnly>
	);
}
