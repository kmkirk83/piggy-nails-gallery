CREATE TABLE `handTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`skinTone` varchar(50),
	`handOrientation` varchar(50) DEFAULT 'palm-up',
	`nailBeds` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `handTemplates_id` PRIMARY KEY(`id`)
);
