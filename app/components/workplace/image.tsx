import { Form, useNavigation } from "@remix-run/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { IntegrationImage } from "~/lib/types/images";
import { forwardRef, RefObject, useRef } from "react";

export type Props = {
	image: IntegrationImage;
	selectedImages?:
		| {
				id: string;
				url: string;
				hasDescription: boolean;
				selected: boolean;
				integration: string;
		  }[][]
		| undefined;
	handleSelectImage: (id: string, selected: boolean) => void;
	index: number;
	scrollTo?: () => void;
};

export const Image = forwardRef<HTMLDivElement, Props>(function Image(
	props,
	ref
) {
	const { image, selectedImages, handleSelectImage, index } = props;
	const { state, formData } = useNavigation();
	const submitting = state === "submitting";
	const image_url = formData?.get("image_url");

	return (
		<div ref={ref} className="rounded-md border overflow-hidden flex flex-col">
			<img
				className="w-full flex-1 max-h-52 object-cover"
				alt={image.name}
				src={image.url}
			/>
			<div className="p-4 ">
				<Form method="post" className="space-y-4">
					<input type="hidden" value={image.id} name="public_id" />
					<input type="hidden" value={image.url} name="image_url" />
					<input type="hidden" value={image.source} name="integration" />
					<Input
						errors={undefined}
						description="ALT text"
						placeholder="Generated ALT text will appear here"
						aria-label="ALT text"
						name="description"
						defaultValue={image.context ? image.context.custom.alt : ""}
						disabled={!image.context}
					/>
					<div className="flex justify-between items-center">
						<Button
							variant={image.context ? "secondary" : "default"}
							disabled={submitting && image_url === image.url}
							type="submit"
							name="_action"
							value={image.context ? "update" : "generate"}
						>
							{submitting && image_url === image.url
								? image.context
									? "Updating..."
									: "Generating..."
								: image.context
								? "Change"
								: "Generate"}
						</Button>
						{!image.context && (
							<Checkbox
								disabled={submitting}
								checked={
									selectedImages
										? selectedImages[index]?.find(({ id }) => image.id === id)
												?.selected
										: false
								}
								onCheckedChange={(value) =>
									handleSelectImage(image.id, !!value)
								}
								aria-label="Select image"
							/>
						)}
					</div>
				</Form>
			</div>
		</div>
	);
});
