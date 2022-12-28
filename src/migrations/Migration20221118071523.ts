import { Migration } from '@mikro-orm/migrations';

export class Migration20221118071523 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `worker` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `token` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `vm` (`id` int unsigned not null auto_increment primary key, `worker_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `vm` add index `vm_worker_id_index`(`worker_id`);');

    this.addSql('create table `ctfjudgement` (`id` int unsigned not null auto_increment primary key, `type` tinyint not null, `status` tinyint not null, `name` varchar(255) not null, `vm_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `ctfjudgement` add unique `ctfjudgement_vm_id_unique`(`vm_id`);');

    this.addSql('alter table `vm` add constraint `vm_worker_id_foreign` foreign key (`worker_id`) references `worker` (`id`) on update cascade;');

    this.addSql('alter table `ctfjudgement` add constraint `ctfjudgement_vm_id_foreign` foreign key (`vm_id`) references `vm` (`id`) on update cascade;');

    this.addSql('drop table if exists `judgement`;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `vm` drop foreign key `vm_worker_id_foreign`;');

    this.addSql('alter table `ctfjudgement` drop foreign key `ctfjudgement_vm_id_foreign`;');

    this.addSql('create table `judgement` (`id` int unsigned not null auto_increment primary key) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `worker`;');

    this.addSql('drop table if exists `vm`;');

    this.addSql('drop table if exists `ctfjudgement`;');
  }

}
