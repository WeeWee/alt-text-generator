CREATE TABLE `users` (
	`token` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`picture` text NOT NULL,
	`provider` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `integrations` (
	`id` text PRIMARY KEY DEFAULT (uuid4()) NOT NULL,
	`title` text NOT NULL,
	`endpoint` text NOT NULL,
	`api_key` text NOT NULL,
	`api_secret` text NOT NULL,
	`workplace_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`workplace_id`) REFERENCES `workplaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workplace_invitations` (
	`email` text NOT NULL,
	`workplace_id` text,
	`invited_by_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`workplace_id`) REFERENCES `workplaces`(`id`) ON UPDATE restrict ON DELETE cascade,
	FOREIGN KEY (`invited_by_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `member_of_workplace` (
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`workplace_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `workplace_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`workplace_id`) REFERENCES `workplaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workplaces` (
	`id` text PRIMARY KEY DEFAULT (uuid4()) NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`owner` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_id_unique` ON `users` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `integrations_id_unique` ON `integrations` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `invitation_unique_workplace_id_email_key` ON `workplace_invitations` (`workplace_id`,`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `workplaces_id_unique` ON `workplaces` (`id`);