import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "ws";
import * as pty from "node-pty"


@WebSocketGateway(4000)
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
    //Do stuffs
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client)
    console.log(`Connected ${client.id}`);
    //Do stuffs

    const term = pty.spawn("bash", ["--login"], {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: process.env,
    });

    term.onData(function (data) {
      console.log(data)
      client.send(data);
    });

    client.on("message", (data) => {
      console.log(data)
      term.write(data);
    });
  }


  @SubscribeMessage('hello')
  hello(@MessageBody() data: any): any {
    return {
      "event": "hello",
      "data": data,
      "msg": 'rustfisher.com'
    };
  }
}