CREATE USER bobowl@localhost;
CREATE SCHEMA bobowl;

grant all on bobowl.* to bobowl@localhost;
use bobowl;

ALTER DATABASE bobowl DEFAULT CHARACTER SET utf8;

CREATE TABLE `users` (
	`user_id`	varchar(30)	NOT NULL,
	`user_passwd`	char(64)	NULL,
	`user_salt`	char(10)	NULL,
	`user_date`	timestamp	NULL default CURRENT_TIMESTAMP
);

CREATE TABLE `wallets` (
	`wallet_addr`	char(44)	NOT NULL,
	`user_id`	varchar(30)	NOT NULL,
	`wallet_id`	char(30)	NULL,
	`wallet_alias`	varchar(50)	NULL,
	`wallet_date`	timestamp	NULL default CURRENT_TIMESTAMP
);

CREATE TABLE `addresses` (
	`address_id`	int	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	varchar(30)	NOT NULL,
	`wallet_addr`	char(44)	NOT NULL,
	`address_explan`	varchar(100)	NULL,
	`address_date`	timestamp	NULL default CURRENT_TIMESTAMP
);
