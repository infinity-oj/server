import { Migration } from '@mikro-orm/migrations';

export class Migration20221118071744 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `judgement` (`id` int unsigned not null auto_increment primary key, `type` tinyint not null, `status` tinyint not null, `discr` enum(\'person\', \'employee\') not null, `name` varchar(255) null, `vm_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `judgement` add index `judgement_discr_index`(`discr`);');
    this.addSql('alter table `judgement` add unique `judgement_vm_id_unique`(`vm_id`);');

    this.addSql('alter table `judgement` add constraint `judgement_vm_id_foreign` foreign key (`vm_id`) references `vm` (`id`) on update cascade on delete set null;');

    this.addSql('drop table if exists `ctfjudgement`;');
  }

  async down(): Promise<void> {
    this.addSql('create table `ctfjudgement` (`id` int unsigned not null auto_increment primary key, `type` tinyint not null, `status` tinyint not null, `name` varchar(255) not null, `vm_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `ctfjudgement` add unique `ctfjudgement_vm_id_unique`(`vm_id`);');

    this.addSql('alter table `ctfjudgement` add constraint `ctfjudgement_vm_id_foreign` foreign key (`vm_id`) references `vm` (`id`) on update cascade;');

    this.addSql('drop table if exists `judgement`;');
  }

}
