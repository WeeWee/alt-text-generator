import { Input } from "./ui/input";
import { SubmitButton } from "./button";
import { Form } from "@remix-run/react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { insertWorkplaceSchema } from "db/schemas";
export function CreateWorkplaceForm({
	lastResult,
	ownerId,
}: {
	lastResult: any;
	ownerId: string;
}) {
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: insertWorkplaceSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	return (
		<Form method="post" className="space-y-6" {...getFormProps(form)}>
			<div className="space-y-2">
				<Input
					description="Name of your workplace"
					aria-label="name"
					defaultValue={fields.name.initialValue}
					placeholder="Example"
					errors={fields.name.errors}
					{...getInputProps(fields.name, { type: "text" })}
				/>
				<input name="owner" type="hidden" value={ownerId} />
				<Input
					description="Description for your workplace"
					aria-label="description"
					defaultValue={fields.description.initialValue}
					placeholder="short description of your workplace"
					errors={fields.description.errors}
					{...getInputProps(fields.description, { type: "text" })}
				/>
			</div>

			<SubmitButton
				variant="outline"
				text="Create a new workplace here"
				submitText="Creating a new workplace..."
				className="mt-10"
			/>
		</Form>
	);
}
