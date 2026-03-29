CREATE TABLE `designComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`designId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `designComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `designHashtags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`designId` int NOT NULL,
	`tag` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `designHashtags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `designRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`designId` int NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `designRatings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `designTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`thumbnailUrl` text,
	`templateData` text NOT NULL,
	`category` varchar(100),
	`difficulty` enum('easy','medium','hard') DEFAULT 'easy',
	`createdBy` int NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `designTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nailDesigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`templateId` int,
	`uploadedImageUrl` text,
	`designData` text,
	`isPublic` int NOT NULL DEFAULT 1,
	`viewCount` int NOT NULL DEFAULT 0,
	`averageRating` int NOT NULL DEFAULT 0,
	`totalRatings` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `nailDesigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productHashtags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(255) NOT NULL,
	`tag` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productHashtags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(255) NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`review` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productRatings_id` PRIMARY KEY(`id`)
);
