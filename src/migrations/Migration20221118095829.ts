import { Migration } from '@mikro-orm/migrations';

export class Migration20221118095829 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `judgement` add `name` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `judgement` drop `name`;');
  }

}
