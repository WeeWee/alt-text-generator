import { Form } from "@remix-run/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { insertInvitationSchema } from "~/routes/_auth+/workplaces+/$workplaceId+/users";

export default function InvitationForm({
	lastResult,
	workplaceId,
}: {
	lastResult: any;
	workplaceId: string;
}) {
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: insertInvitationSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	const formProps = getFormProps(form);
	const emailProps = getInputProps(fields.email, { type: "email" });
	const workplaceIdProps = getInputProps(fields.workplaceId, {
		type: "hidden",
	});
	return (
		<Form {...formProps} method="post" className="flex flex-col max-w-xs gap-4">
			<input {...workplaceIdProps} value={workplaceId} />
			<Input
				{...emailProps}
				placeholder="Email"
				description={"Email"}
				errors={fields.email.errors}
			/>
			<Button type="submit" name="_action" value={"create_invitation"}>
				Invite
			</Button>
		</Form>
	);
}
