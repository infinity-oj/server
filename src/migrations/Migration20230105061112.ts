import { Migration } from '@mikro-orm/migrations';

export class Migration20230105061112 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `client` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `token` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `client` add unique `client_name_unique`(`name`);');

    this.addSql('create table `judgement` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `client_id` int unsigned not null, `status` tinyint not null, `public_volume` varchar(255) null, `private_volume` varchar(255) null, `user_volume` varchar(255) null, `token` varchar(255) null, `file_token` varchar(255) null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `judgement` add index `judgement_client_id_index`(`client_id`);');

    this.addSql('create table `worker` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `token` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `vm` (`id` int unsigned not null auto_increment primary key, `worker_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `vm` add index `vm_worker_id_index`(`worker_id`);');

    this.addSql('alter table `judgement` add constraint `judgement_client_id_foreign` foreign key (`client_id`) references `client` (`id`) on update cascade;');

    this.addSql('alter table `vm` add constraint `vm_worker_id_foreign` foreign key (`worker_id`) references `worker` (`id`) on update cascade;');
  }

}
