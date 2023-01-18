import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import _ from 'lodash';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async find(@Query('type') type: string) {
    if (_.isEmpty(type)) {
      throw new BadRequestException();
    }

    const task = await this.taskService.fetchOneByType(type);
    if (_.isEmpty(task)) {
      throw new NotFoundException();
    }
    return task;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.submit(id, updateTaskDto.outputs);
  }
}
