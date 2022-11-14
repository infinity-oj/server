import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as pty from 'node-pty';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5173',
  },
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {}

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
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

  @SubscribeMessage('register')
  handleRegister(client: Socket, data) {
    console.log(data);
    if (data === 'USER') {
      // const term = pty.spawn("ssh", ["-p", "2222", "-t", "root@127.0.0.1", 'podman run --rm -it ubuntu /bin/bash'], {
      // const term = pty.spawn("podman", ["run", "--rm", "-it", "-v", "/home/hitomi/Developer/seed/Labsetup/server-code:/bof", "ubuntu", "/bin/bash"], {
      const term = pty.spawn('bash', ['--login'], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env,
      });
      client.on('term-input', (data) => term.write(data));
      term.onData((data) => client.emit('term-output', data));
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: string) {
    console.log(data);
    client.emit('env', 'CREATE');
  }
}
