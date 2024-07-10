import { Form, useNavigate, useNavigation } from "@remix-run/react";
import { Input } from "../ui/input";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import z from "zod";
import { Button } from "../ui/button";
export const schema = z.object({
	endpoint: z.string().min(6),
	apiKey: z.string().min(6),
	apiSecret: z.string().min(6),
	workplaceId: z.string(),
	title: z.string(),
});
export function SettingsForm({
	workplaceId,
	lastResult,
	title,
}: {
	workplaceId: string;
	lastResult: any;
	title: string;
}) {
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});
	const workplaceIdProps = getInputProps(fields.workplaceId, { type: "text" });
	const titleProps = getInputProps(fields.title, { type: "text" });
	const endpointProps = getInputProps(fields.endpoint, { type: "text" });
	const apiKeyProps = getInputProps(fields.apiKey, { type: "text" });
	const apiSecretProps = getInputProps(fields.apiSecret, { type: "text" });
	const navigation = useNavigation();
	const submitting = navigation.state === "submitting";
	return (
		<Form method="post" className="space-y-6 " {...getFormProps(form)}>
			<div className="space-y-2">
				<p className="text-xl font-bold capitalize">{title}</p>
				<input {...workplaceIdProps} type="hidden" value={workplaceId} />
				<input {...titleProps} type="hidden" value={title} />
				<Input
					{...endpointProps}
					errors={fields.endpoint.errors}
					description={"Endpoint"}
					defaultValue={fields.endpoint.initialValue}
					aria-label={"Endpoint"}
					placeholder="Enter your value here"
				/>
				<Input
					{...apiKeyProps}
					errors={fields.apiKey.errors}
					description={"API key"}
					defaultValue={fields.apiKey.initialValue}
					aria-label={"API key"}
					placeholder="Enter your value here"
				/>
				<Input
					{...apiSecretProps}
					errors={fields.apiSecret.errors}
					description={"API secret"}
					defaultValue={fields.apiSecret.initialValue}
					aria-label={"API secret"}
					placeholder="Enter your value here"
				/>
			</div>
			<Button
				className=" max-w-sm w-full"
				type="submit"
				disabled={!form.dirty || submitting}
			>
				{submitting ? "Adding" : "Add"}
			</Button>
		</Form>
	);
}
