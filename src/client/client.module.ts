import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Client } from './entities/client.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
