CREATE TABLE `fulfillmentJobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`supplierId` int,
	`mode` varchar(32) NOT NULL DEFAULT 'simulation',
	`status` varchar(32) NOT NULL DEFAULT 'queued',
	`idempotencyKey` varchar(255) NOT NULL,
	`requestPayload` text NOT NULL,
	`responsePayload` text,
	`supplierOrderId` varchar(255),
	`errorMessage` text,
	`attempts` int NOT NULL DEFAULT 0,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fulfillmentJobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `fulfillmentJobs_idempotencyKey_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `productSupplierMappings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` varchar(128) NOT NULL,
	`supplierId` int NOT NULL,
	`supplierProductId` varchar(255) NOT NULL,
	`supplierVariantId` varchar(255) NOT NULL,
	`supplierSku` varchar(255) NOT NULL,
	`unitCostCents` int,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`isActive` boolean NOT NULL DEFAULT false,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `productSupplierMappings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptionBoxSelections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriptionId` int NOT NULL,
	`productId` varchar(128) NOT NULL,
	`position` int NOT NULL,
	`selectionSource` varchar(32) NOT NULL DEFAULT 'custom',
	`status` varchar(32) NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptionBoxSelections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supplierKey` varchar(64) NOT NULL,
	`name` varchar(128) NOT NULL,
	`mode` varchar(32) NOT NULL DEFAULT 'simulation',
	`isActive` boolean NOT NULL DEFAULT false,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`),
	CONSTRAINT `suppliers_supplierKey_unique` UNIQUE(`supplierKey`)
);
--> statement-breakpoint
CREATE TABLE `webhookDeliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`provider` varchar(64) NOT NULL,
	`externalEventId` varchar(255) NOT NULL,
	`eventType` varchar(128) NOT NULL,
	`signatureVerified` boolean NOT NULL DEFAULT false,
	`processingStatus` varchar(32) NOT NULL DEFAULT 'received',
	`payload` text NOT NULL,
	`errorMessage` text,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhookDeliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orders` ADD `stripeSessionId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `productId` varchar(128);--> statement-breakpoint
ALTER TABLE `orders` ADD `metadata` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `supplierOrderId` varchar(255);--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `selectionMode` varchar(32) DEFAULT 'seasonal' NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `seasonalOptIn` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `boxPreferences` text;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_stripeSessionId_unique` UNIQUE(`stripeSessionId`);