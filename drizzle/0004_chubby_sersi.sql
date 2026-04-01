CREATE TABLE `backups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commitHash` varchar(255) NOT NULL,
	`commitMessage` text NOT NULL,
	`backupType` varchar(50) NOT NULL,
	`fileCount` int,
	`totalSize` int,
	`checksum` varchar(255),
	`status` enum('success','failed','pending') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `backups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','in_progress','completed') DEFAULT 'pending',
	`completedAt` timestamp,
	`metrics` text,
	`commitHash` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('revenue','cost') NOT NULL,
	`amount` int NOT NULL,
	`category` varchar(100) NOT NULL,
	`orderId` int,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
