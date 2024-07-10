import * as React from "react";

import { cn } from "~/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	description: string;
	errors: string[] | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, name, errors, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1 ">
				<label
					htmlFor={props.id}
					className=" py-2 text-muted-foreground text-sm"
				>
					{props.description}
				</label>
				<input
					name={name}
					type={type}
					className={cn(
						"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className
					)}
					ref={ref}
					{...props}
				/>
				{errors && errors.length > 0 && (
					<span className=" text-red-500 text-sm ">{errors.at(0)}</span>
				)}
			</div>
		);
	}
);
Input.displayName = "Input";

export { Input };
