import { Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Program } from './entities/program.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Program])],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}
