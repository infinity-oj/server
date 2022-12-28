import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WorkerService } from '@/worker/worker.service';
import { MikroORM, UseRequestContext, UuidType } from '@mikro-orm/core';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { v4 as uuid } from 'uuid';
import { JudgementService } from '@/judgement/judgement.service';
import { CTFJudgement } from '@/judgement/entities/judgement.entity';

// TODO: use redis!
// workerMap maps worker id to the worker socket
let workerMap = new Map<number, Socket>();

// userMap maps session to the user socket
let userMap = new Map<string, Socket>();

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private orm: MikroORM,
    private readonly workerService: WorkerService,
    private readonly judgementService: JudgementService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer() server: Server;
  afterInit(server: Server) {}

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    client.removeAllListeners();
  }

  handleConnection(client: Socket, ...args: any[]) {
    // console.log(client);
    console.log(`Connected ${client.id}`);

    // term.onData(function (data) {
    //   client.send(data);
    // });

    // client.on("message", (data) => {
    //   term.write(data);
    // });
  }

  // @OnEvent('vm.create')
  // handleVmCreateEvent(payload: OrderCreatedEvent) {
  //   // handle and process "OrderCreatedEvent" event
  // }

  @SubscribeMessage('register')
  @UseRequestContext()
  async handleRegister(client: Socket, data: any) {
    console.log(data);
    const { type } = data;
    if (type === 'judger') {
      const { name, token } = data;
      if (!name || !token) {
        client.send('invalid');
        client.disconnect();
        return;
      }

      const worker = await this.workerService.findByName(name);
      if (worker.token !== token) {
        client.send('invalid');
        client.disconnect();
        return;
      }
      workerMap.set(worker.id, client);
    }
    if (type === 'user') {
      const { judgement } = data;
      if (!judgement) {
        client.send('invalid');
        client.disconnect();
        return;
      }
      const j = await this.judgementService.findoneCTFJudgementByName(
        judgement,
      );
      if (!j) {
        client.send('invalid');
        client.disconnect();
        return;
      }

      const session = uuid();
      console.log(judgement, session);
      userMap.set(session, client);

      console.log(j.vm);
      // wait for corresponding worker to be online
      const int = setInterval(() => {
        const workerId = j.vm.worker.id;
        if (workerMap.has(workerId)) {
          const worker = workerMap.get(j.vm.worker.id);
          if (worker) {
            worker.emit('env', { opt: 'CREATE', session, context: judgement });
            clearInterval(int);
          }
        }
      }, 1000);
    }
    if (type === 'vm') {
      const { session } = data;
      const user = userMap.get(session);
      if (!user || user.disconnected) {
        client.send('gone');
        client.disconnect();
        return;
      }

      user.emit('term-ready');

      user.on('term-input', (data: string) => {
        client.emit('term-input', data);
      });

      client.on('term-output', (data: string) => {
        user.emit('term-output', data);
      });
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: string) {
    // console.log(data);
    // client.emit('env', 'CREATE');
  }
}
