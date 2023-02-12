import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { InterpreterModule } from '@/interpreter/interpreter.module';
import { FileModule } from '@/file/file.module';

@Module({
  imports: [InterpreterModule, FileModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
