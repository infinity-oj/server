import { Module } from '@nestjs/common';
import { JudgementService } from './judgement.service';
import { JudgementController } from './judgement.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClientModule } from '@/client/client.module';
import { Judgement } from './entities/judgement.entity';
import { ProgramModule } from '@/program/program.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MikroOrmModule.forFeature([Judgement]),
    HttpModule,
    ClientModule,
    ProgramModule,
  ],
  controllers: [JudgementController],
  providers: [JudgementService],
  exports: [JudgementService],
})
export class JudgementModule {}
