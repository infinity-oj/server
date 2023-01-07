import { Migration } from '@mikro-orm/migrations';

export class Migration20230107145517 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `program` add unique `program_name_unique`(`name`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `program` drop index `program_name_unique`;');
  }

}
