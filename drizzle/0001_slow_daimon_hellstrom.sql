CREATE TABLE `comparables` (
	`id` varchar(64) NOT NULL,
	`valuationId` varchar(64) NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`district` varchar(100) NOT NULL,
	`area` int NOT NULL,
	`price` int NOT NULL,
	`pricePerSqm` int NOT NULL,
	`source` varchar(100),
	`sourceUrl` text,
	`distance` int,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `comparables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketData` (
	`id` varchar(64) NOT NULL,
	`district` varchar(100) NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`avgPricePerSqm` int NOT NULL,
	`sampleSize` int NOT NULL,
	`minPrice` int,
	`maxPrice` int,
	`source` varchar(100),
	`lastUpdated` timestamp DEFAULT (now()),
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `marketData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `valuations` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`propertyType` varchar(50) NOT NULL,
	`district` varchar(100) NOT NULL,
	`area` int NOT NULL,
	`age` int,
	`finishingQuality` varchar(50),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`amenities` text,
	`specialFeatures` text,
	`estimatedValue` int NOT NULL,
	`confidenceScore` int NOT NULL,
	`valuationMethod` varchar(50),
	`pricePerSqm` int,
	`marketDataTimestamp` timestamp,
	`reportGenerated` boolean DEFAULT false,
	`reportUrl` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `valuations_id` PRIMARY KEY(`id`)
);
