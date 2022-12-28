import { Migration } from '@mikro-orm/migrations';

export class Migration20221118072127 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `judgement` modify `id` int unsigned not null, modify `status` tinyint null;');
    this.addSql('alter table `judgement` drop `name`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `judgement` add `name` varchar(255) null;');
    this.addSql('alter table `judgement` modify `id` int unsigned null, modify `status` tinyint not null;');
  }

}
