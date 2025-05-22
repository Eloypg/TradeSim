import { Migration } from '@mikro-orm/migrations';

export class Migration20250521171406 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "tutorial" ("tutorial_id" uuid not null default gen_random_uuid(), "title" varchar(255) not null, "description" varchar(255) not null, "url" varchar(255) not null, "posted_at" timestamptz not null, constraint "tutorial_pkey" primary key ("tutorial_id"));`);

    this.addSql(`create table "cripto" ("cripto_id" uuid not null default gen_random_uuid(), "symbol" varchar(255) not null, "name" varchar(255) not null, "precision" int not null default 8, "current_price" numeric(20,8) not null, "wallet_wallet_id" uuid not null, constraint "cripto_pkey" primary key ("cripto_id"));`);

    this.addSql(`create table "transaction" ("transaction_id" uuid not null default gen_random_uuid(), "type" varchar(255) not null, "amount" numeric(20,8) not null, "price_per_unit" int null, "executed_at" timestamptz not null, "wallet_wallet_id" uuid not null, "cripto_cripto_id" uuid null, constraint "transaction_pkey" primary key ("transaction_id"));`);

    this.addSql(`alter table "cripto" add constraint "cripto_wallet_wallet_id_foreign" foreign key ("wallet_wallet_id") references "wallet" ("wallet_id") on update cascade;`);

    this.addSql(`alter table "transaction" add constraint "transaction_wallet_wallet_id_foreign" foreign key ("wallet_wallet_id") references "wallet" ("wallet_id") on update cascade;`);
    this.addSql(`alter table "transaction" add constraint "transaction_cripto_cripto_id_foreign" foreign key ("cripto_cripto_id") references "cripto" ("cripto_id") on update cascade on delete set null;`);

    this.addSql(`alter table "wallet" add column "balance" numeric(15,2) not null default 0, add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transaction" drop constraint "transaction_cripto_cripto_id_foreign";`);

    this.addSql(`drop table if exists "tutorial" cascade;`);

    this.addSql(`drop table if exists "cripto" cascade;`);

    this.addSql(`drop table if exists "transaction" cascade;`);

    this.addSql(`alter table "wallet" drop column "balance", drop column "created_at", drop column "updated_at";`);
  }

}
