CREATE TABLE `socialMediaAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`platform` varchar(50) NOT NULL,
	`accountName` varchar(255) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`externalAccountId` varchar(255),
	`followers` int DEFAULT 0,
	`isConnected` int DEFAULT 1,
	`connectedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `socialMediaAccounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialMediaMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`platform` varchar(50) NOT NULL,
	`externalPostId` varchar(255),
	`likes` int DEFAULT 0,
	`comments` int DEFAULT 0,
	`shares` int DEFAULT 0,
	`views` int DEFAULT 0,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`saves` int DEFAULT 0,
	`engagement` int DEFAULT 0,
	`reachCount` int DEFAULT 0,
	`followerGrowth` int DEFAULT 0,
	`lastUpdated` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialMediaMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialMediaPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`imageUrl` text,
	`videoUrl` text,
	`platforms` varchar(255) NOT NULL,
	`scheduledAt` timestamp,
	`publishedAt` timestamp,
	`status` varchar(50) DEFAULT 'draft',
	`hashtags` text,
	`caption` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `socialMediaPosts_id` PRIMARY KEY(`id`)
);
