import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = new Client();

    client.name = createClientDto.name;
    client.token = uuid();

    await this.clientRepository.persistAndFlush(client);

    return client;
  }

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  async findOneByToken(token: string) {
    const client = await this.clientRepository.findOne({ token });
    return client;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
