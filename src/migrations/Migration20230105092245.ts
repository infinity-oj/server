import { Migration } from '@mikro-orm/migrations';

export class Migration20230105092245 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `program` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `inputs` json not null, `outputs` json not null, `programs` json not null, `links` json not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `client` add `callback_url` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `program`;');

    this.addSql('alter table `client` drop `callback_url`;');
  }

}
