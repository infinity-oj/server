import { Module } from '@nestjs/common';
import { JudgementService } from './judgement.service';
import { JudgementController } from './judgement.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Judgement } from './entities/judgement.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Judgement])],
  controllers: [JudgementController],
  providers: [JudgementService],
  exports: [JudgementService],
})
export class JudgementModule {}
