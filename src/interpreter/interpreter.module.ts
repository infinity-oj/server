import { ProgramModule } from '@/program/program.module';
import { Module } from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { InterpreterController } from './interpreter.controller';

@Module({
  imports: [ProgramModule],
  providers: [InterpreterService],
  controllers: [InterpreterController],
  exports: [InterpreterService],
})
export class InterpreterModule {}
