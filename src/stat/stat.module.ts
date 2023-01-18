import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { TaskModule } from '@/task/task.module';

@Module({
  imports: [TaskModule],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
