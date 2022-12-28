import { Migration } from '@mikro-orm/migrations';

export class Migration20221118063439 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `judgement` (`id` int unsigned not null auto_increment primary key) default character set utf8mb4 engine = InnoDB;');
  }

}
