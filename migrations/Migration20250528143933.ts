import { Migration } from '@mikro-orm/migrations';

export class Migration20250528143933 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "wallet" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "wallet" alter column "updated_at" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "wallet" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "wallet" alter column "updated_at" set not null;`);
  }

}
