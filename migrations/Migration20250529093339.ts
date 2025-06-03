import { Migration } from '@mikro-orm/migrations';

export class Migration20250529093339 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "wallet" drop column "updated_at";`);

    this.addSql(`alter table "cripto" rename column "current_price" to "current_unit_price";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "wallet" add column "updated_at" timestamptz null;`);

    this.addSql(`alter table "cripto" rename column "current_unit_price" to "current_price";`);
  }

}
