import { Module } from '@nestjs/common';
import { JudgementService } from './judgement.service';
import { JudgementController } from './judgement.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClientService } from '@/client/client.service';
import { ClientModule } from '@/client/client.module';
import { Judgement } from './entities/judgement.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Judgement]), ClientModule],
  controllers: [JudgementController],
  providers: [JudgementService],
  exports: [JudgementService],
})
export class JudgementModule {}
