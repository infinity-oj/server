import { ProgramModule } from '@/program/program.module';
import { Module } from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { InterpreterController } from './interpreter.controller';

@Module({
  imports: [ProgramModule],
  providers: [InterpreterService],
  controllers: [InterpreterController],
})
export class InterpreterModule {}
