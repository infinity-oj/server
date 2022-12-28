import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { Worker } from './entities/worker.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Worker])],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
