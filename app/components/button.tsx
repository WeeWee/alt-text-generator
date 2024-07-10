import { useNavigation } from "@remix-run/react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "~/lib/utils";

interface SubmitButtonProps extends ButtonProps {
	text: string;
	submitText: string;
}

export const SubmitButton = ({
	text,
	submitText,
	...props
}: SubmitButtonProps) => {
	const { state } = useNavigation();
	const submitting = state === "submitting";
	return (
		<Button
			{...props}
			type="submit"
			disabled={submitting}
			className={cn(submitting ? "bg-muted" : "", props.className)}
		>
			{submitting ? submitText : text}
		</Button>
	);
};
