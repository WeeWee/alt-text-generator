import { Form } from "@remix-run/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { UserType } from "~/services/user.server";
import { useState } from "react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { updateUserSchema } from "~/routes/_auth+/account+";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function AccountSheet({
	user,
	lastResult,
}: {
	user: UserType;
	lastResult: any;
}) {
	const [picture, setPicture] = useState(user?.picture ?? "");
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: updateUserSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	const formProps = getFormProps(form);
	const nameProps = getInputProps(fields.name, { type: "text" });
	const pictureProps = getInputProps(fields.picture, { type: "url" });
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Edit profile</Button>
			</SheetTrigger>
			<SheetContent>
				<Form method="post" {...formProps}>
					<SheetHeader>
						<SheetTitle>Edit profile</SheetTitle>
						<SheetDescription>
							Make changes to your profile here. Click save when you're done.
						</SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<Input
							{...nameProps}
							id="name"
							defaultValue={user?.name}
							className=""
							errors={fields.name.errors}
							description={"Name"}
						/>

						<Input
							{...pictureProps}
							id="picture"
							value={picture}
							className=""
							description={"Picture"}
							errors={fields.picture.errors}
							onChange={(e) => setPicture(e.target.value)}
						/>
						<Avatar>
							<AvatarImage
								src={picture}
								alt={`${user?.name}´s profile picture`}
							/>
							<AvatarFallback className="">{user?.name.at(0)}</AvatarFallback>
						</Avatar>
					</div>
					<SheetFooter>
						<SheetClose asChild>
							<Button type="submit" name="_action" value="update_user">
								Save changes
							</Button>
						</SheetClose>
					</SheetFooter>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
