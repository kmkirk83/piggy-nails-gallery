CREATE TABLE `notificationPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`emailNotifications` boolean DEFAULT true,
	`inAppNotifications` boolean DEFAULT true,
	`orderUpdates` boolean DEFAULT true,
	`subscriptionAlerts` boolean DEFAULT true,
	`promotionalEmails` boolean DEFAULT true,
	`weeklyDigest` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notificationPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notificationPreferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('info','success','warning','error') DEFAULT 'info',
	`category` varchar(50),
	`actionUrl` varchar(500),
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
