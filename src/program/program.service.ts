import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { Program } from './entities/program.entity';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: EntityRepository<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto) {
    const program = new Program();
    program.name = createProgramDto.name;
    program.inputs = createProgramDto.inputs;
    program.outputs = createProgramDto.outputs;
    program.links = createProgramDto.links;
    program.programs = createProgramDto.programs;

    await this.programRepository.persistAndFlush(program);
    return program;
  }

  findAll() {
    return `This action returns all program`;
  }

  findOne(id: number) {
    return `This action returns a #${id} program`;
  }

  async findOneByName(name: string) {
    const program = await this.programRepository.findOne({ name });
    return program;
  }

  update(id: number, updateProgramDto: UpdateProgramDto) {
    return `This action updates a #${id} program`;
  }

  remove(id: number) {
    return `This action removes a #${id} program`;
  }
}
