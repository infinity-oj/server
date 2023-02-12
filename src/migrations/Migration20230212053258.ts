import { Migration } from '@mikro-orm/migrations';

export class Migration20230212053258 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `file` (`id` int unsigned not null auto_increment primary key, `uuid` varchar(36) not null, `size` int not null, `upload_time` datetime not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `judgement` add `program_id` int unsigned not null, add `inputs` json null, add `outputs` json null;');
    this.addSql('alter table `judgement` add constraint `judgement_program_id_foreign` foreign key (`program_id`) references `program` (`id`) on update cascade;');
    this.addSql('alter table `judgement` drop `public_volume`;');
    this.addSql('alter table `judgement` drop `private_volume`;');
    this.addSql('alter table `judgement` drop `user_volume`;');
    this.addSql('alter table `judgement` add index `judgement_program_id_index`(`program_id`);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `file`;');

    this.addSql('alter table `judgement` drop foreign key `judgement_program_id_foreign`;');

    this.addSql('alter table `judgement` add `public_volume` varchar(255) null, add `private_volume` varchar(255) null, add `user_volume` varchar(255) null;');
    this.addSql('alter table `judgement` drop index `judgement_program_id_index`;');
    this.addSql('alter table `judgement` drop `program_id`;');
    this.addSql('alter table `judgement` drop `inputs`;');
    this.addSql('alter table `judgement` drop `outputs`;');
  }

}
