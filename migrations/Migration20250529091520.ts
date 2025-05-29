import { Migration } from '@mikro-orm/migrations';

export class Migration20250529091520 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "transaction" drop constraint "transaction_cripto_cripto_id_foreign";`);

    this.addSql(`alter table "transaction" drop column "price_per_unit";`);

    this.addSql(`alter table "transaction" add column "cripto_price_per_unit" numeric(20,8) not null, add column "total_price_transaction" numeric(20,8) not null;`);
    this.addSql(`alter table "transaction" alter column "cripto_cripto_id" drop default;`);
    this.addSql(`alter table "transaction" alter column "cripto_cripto_id" type uuid using ("cripto_cripto_id"::text::uuid);`);
    this.addSql(`alter table "transaction" alter column "cripto_cripto_id" set not null;`);
    this.addSql(`alter table "transaction" add constraint "transaction_cripto_cripto_id_foreign" foreign key ("cripto_cripto_id") references "cripto" ("cripto_id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transaction" drop constraint "transaction_cripto_cripto_id_foreign";`);

    this.addSql(`alter table "transaction" drop column "cripto_price_per_unit", drop column "total_price_transaction";`);

    this.addSql(`alter table "transaction" add column "price_per_unit" int null;`);
    this.addSql(`alter table "transaction" alter column "cripto_cripto_id" drop default;`);
    this.addSql(`alter table "transaction" alter column "cripto_cripto_id" type uuid using ("cripto_cripto_id"::text::uuid);`);
    this.addSql(`alter table "transaction" alter column "cripto_cripto_id" drop not null;`);
    this.addSql(`alter table "transaction" add constraint "transaction_cripto_cripto_id_foreign" foreign key ("cripto_cripto_id") references "cripto" ("cripto_id") on update cascade on delete set null;`);
  }

}
