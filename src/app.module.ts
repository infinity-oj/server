import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WsModule } from './ws/ws.module';
import { CoreModule } from './core/core.module';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { MikroORM } from '@mikro-orm/core';
import { JudgementModule } from './judgement/judgement.module';
import { UserModule } from './user/user.module';
import { WorkerModule } from './worker/worker.module';
import { VmModule } from './vm/vm.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientModule } from './client/client.module';
import { TaskModule } from './task/task.module';
import { InterpreterModule } from './interpreter/interpreter.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ProgramModule } from './program/program.module';
import { FileModule } from './file/file.module';
import { StatModule } from './stat/stat.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),

    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env', '.env.production'],
    }),

    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),

    MikroOrmModule.forRoot(),
    WsModule,
    CoreModule,
    JudgementModule,
    UserModule,
    WorkerModule,
    VmModule,
    ClientModule,
    TaskModule,
    InterpreterModule,
    ProgramModule,
    FileModule,
    StatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }

  // for some reason the auth middlewares in profile and article modules are fired before the request context one,
  // so they would fail to access contextual EM. by registering the middleware directly in AppModule, we can get
  // around this issue
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
