import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { JudgementService } from './judgement.service';
import {
  CreateJudgementDto,
  CreateTraditionalJudgementDto,
} from './dto/create-judgement.dto';
import { UpdateJudgementDto } from './dto/update-judgement.dto';
import { ClientService } from '@/client/client.service';

@Controller('judgement')
export class JudgementController {
  constructor(
    private readonly judgementService: JudgementService,
    private readonly clientService: ClientService,
  ) {}

  @Post()
  create(@Body() createJudgementDto: CreateJudgementDto) {
    return this.judgementService.create(createJudgementDto);
  }

  @Post('/traditional')
  async createTraditionalJudgement(@Body() dto: CreateTraditionalJudgementDto) {
    const client = await this.clientService.findOneByToken(dto.clientToken);
    if (!client) {
      throw new ForbiddenException();
    }
    return await this.judgementService.createJudgement(client);
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
  update(
    @Param('id') id: string,
    @Body() updateJudgementDto: UpdateJudgementDto,
  ) {
    return this.judgementService.update(+id, updateJudgementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.judgementService.remove(+id);
  }
}
