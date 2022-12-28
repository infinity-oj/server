import { grpcClientOptions } from '@/grpc-client.option';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CoreController } from './core.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HERO_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [CoreController],
})
export class CoreModule {}
