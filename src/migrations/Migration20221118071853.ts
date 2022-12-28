import { Migration } from '@mikro-orm/migrations';

export class Migration20221118071853 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `judgement` modify `type` enum(\'judgement\', \'ctfJudgement\') not null;');
    this.addSql('alter table `judgement` drop index `judgement_discr_index`;');
    this.addSql('alter table `judgement` drop `discr`;');
    this.addSql('alter table `judgement` add index `judgement_type_index`(`type`);');
  }

  async down(): Promise<void> {
    this.addSql('alter table `judgement` add `discr` enum(\'person\', \'employee\') not null;');
    this.addSql('alter table `judgement` modify `type` tinyint not null;');
    this.addSql('alter table `judgement` drop index `judgement_type_index`;');
    this.addSql('alter table `judgement` add index `judgement_discr_index`(`discr`);');
  }

}
