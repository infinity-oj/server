import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatService } from './stat.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { TaskService } from '@/task/task.service';

@Controller('stat')
export class StatController {
  constructor(
    private readonly statService: StatService,
    private readonly taskService: TaskService,
  ) {}

  @Post()
  create(@Body() createStatDto: CreateStatDto) {
    return this.statService.create(createStatDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (id === 'task') {
    }
    return this.statService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatDto: UpdateStatDto) {
    return this.statService.update(+id, updateStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statService.remove(+id);
  }
}
