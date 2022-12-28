import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JudgementService } from './judgement.service';
import { CreateJudgementDto } from './dto/create-judgement.dto';
import { UpdateJudgementDto } from './dto/update-judgement.dto';

@Controller('judgement')
export class JudgementController {
  constructor(private readonly judgementService: JudgementService) {}

  @Post()
  create(@Body() createJudgementDto: CreateJudgementDto) {
    return this.judgementService.create(createJudgementDto);
  }

  @Get()
  findAll() {
    return this.judgementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.judgementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJudgementDto: UpdateJudgementDto) {
    return this.judgementService.update(+id, updateJudgementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.judgementService.remove(+id);
  }
}
