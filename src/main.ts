import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc-client.option';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);
  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
