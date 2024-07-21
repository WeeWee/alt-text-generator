import { Link } from "@remix-run/react";
import { Button } from "../ui/button";

export function CallToAction() {
	return (
		<section className="flex flex-col items-center justify-center mt-8 gap-4 text-center">
			<div>
				<h2 className="font-bold text-xl md:text-3xl leading-normal">
					Start for free today
				</h2>
				<p className="text-muted-foreground text-sm">
					All images are free. No credit card required.
				</p>
			</div>
			<Button asChild>
				<Link to="/login">Start now</Link>
			</Button>
		</section>
	);
}
