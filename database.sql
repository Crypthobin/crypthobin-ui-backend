CREATE USER bobowl@localhost;
CREATE SCHEMA bobowl;

grant all on bobowl.* to bobowl@localhost;
use bobowl;

CREATE TABLE `users` (
	`user_id`	varchar(30)	NOT NULL,
	`user_passwd`	char(64) NOT NULL,
	`user_salt`	char(10)	NOT NULL,
	`user_date`	timestamp NOT	NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `wallets` (
	`wallet_addr`	char(44)	NOT NULL,
	`user_id`	varchar(30)	NOT NULL,
	`wallet_alias`	varchar(50)	NOT NULL,
	`wallet_date`	timestamp	NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `addresses` (
	`address_id`	int	NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`user_id`	varchar(30)	NOT NULL,
	`wallet_addr`	char(44)	NOT NULL,
	`address_explan`	varchar(100)	NULL,
	`address_date`	timestamp NOT	NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `transactions` (
	`wallet_addr_from`	char(44)	NOT NULL,
	`wallet_addr_to`	char(44)	NOT NULL,
	`trans_amount`	int	NULL,
	`trans_date`	timestamp	NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `users` ADD CONSTRAINT `PK_USERS` PRIMARY KEY (
	`user_id`
);

ALTER TABLE `wallets` ADD CONSTRAINT `PK_WALLETS` PRIMARY KEY (
	`wallet_addr`,
	`user_id`
);

ALTER TABLE `addresses` ADD CONSTRAINT `PK_ADDRESSES` PRIMARY KEY (
	`address_id`
);

ALTER TABLE `wallets` ADD CONSTRAINT `FK_users_TO_wallets_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `users` (
	`user_id`
);
