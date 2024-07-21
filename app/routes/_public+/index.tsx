import type { MetaFunction } from "@remix-run/node";
import { CallToAction, Functionality, Hero } from "~/components/landing-page";

export const meta: MetaFunction = () => {
	return [
		{ title: "ALT Text" },
		{
			name: "description",
			content: "ALT Text, the innovative SEO tool for you",
		},
	];
};

export default function Index() {
	return (
		<div>
			<Hero />

			<Functionality />
			<section className="flex flex-col items-center justify-center">
				<div className="mt-4 text-muted-foreground max-w-[70ch] text-center text-sm">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum suscipit
					quidem possimus sapiente! Praesentium pariatur, quis doloremque
					corporis eaque facere corrupti impedit quod iure eos minus, ducimus
					alias totam autem! Lorem ipsum dolor sit amet consectetur adipisicing
					elit. Id fugiat distinctio animi doloribus. Tempore officiis inventore
					quibusdam totam magni, corrupti suscipit! Neque quisquam, doloribus
					laborum rerum dolorum quia expedita nam? Lorem ipsum dolor sit, amet
					consectetur adipisicing elit. Officia debitis sint repellendus aperiam
					assumenda quibusdam ullam? Aliquid alias veniam sint. Consequatur est
					quisquam aspernatur deleniti repellat vero cumque illo ipsam.
				</div>
			</section>
			<CallToAction />
		</div>
	);
}
