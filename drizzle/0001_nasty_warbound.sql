ALTER TABLE `account` ADD `accessToken` text;--> statement-breakpoint
ALTER TABLE `account` ADD `refreshToken` text;--> statement-breakpoint
ALTER TABLE `account` ADD `idToken` text;--> statement-breakpoint
ALTER TABLE `account` ADD `accessTokenExpiresAt` integer;--> statement-breakpoint
ALTER TABLE `account` ADD `refreshTokenExpiresAt` integer;--> statement-breakpoint
ALTER TABLE `account` ADD `scope` text;--> statement-breakpoint
ALTER TABLE `jwks` ADD `expiresAt` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `displayUsername` text;--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`userId`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);