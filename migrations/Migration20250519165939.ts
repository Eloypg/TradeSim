import { Migration } from '@mikro-orm/migrations';

export class Migration20250519165939 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "wallet" ("wallet_id" uuid not null default gen_random_uuid(), constraint "wallet_pkey" primary key ("wallet_id"));`);

    this.addSql(`create table "user" ("user_id" uuid not null, "name" varchar(255) not null, "surname" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "wallet_wallet_id" uuid not null, constraint "user_pkey" primary key ("user_id"));`);
    this.addSql(`alter table "user" add constraint "user_wallet_wallet_id_unique" unique ("wallet_wallet_id");`);

    this.addSql(`alter table "user" add constraint "user_wallet_wallet_id_foreign" foreign key ("wallet_wallet_id") references "wallet" ("wallet_id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_wallet_wallet_id_foreign";`);

    this.addSql(`drop table if exists "wallet" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
