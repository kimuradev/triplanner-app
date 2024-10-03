CREATE TABLE `activities` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`occurs_at` integer NOT NULL,
	`trip_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` integer PRIMARY KEY NOT NULL,
	`destination` text NOT NULL,
	`starts_at` integer NOT NULL,
	`ends_at` integer NOT NULL,
	`isConfirmed` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (current_timestamp) NOT NULL
);
