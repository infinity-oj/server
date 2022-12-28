import { JudgementModule } from '@/judgement/judgement.module';
import { WorkerModule } from '@/worker/worker.module';
import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';

@Module({
  imports: [WorkerModule, JudgementModule],
  providers: [WsGateway],
})
export class WsModule {}
