import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  // @InjectModel(Game.name)
  // private readonly gameModel: Model<Game>;

  // @SubscribeMessage('create')
  // public async create(client: any, payload: any): Promise<any> {
  //   console.log('create', { payload });
  //   const game = new this.gameModel();
  //   await game.save();
  //   return game;
  // }

  private readonly logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    console.log('Init');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`, { args });
    this.server.emit('message', 'hi connected');
  }

  @SubscribeMessage('message1')
  handleMessage(client: any, payload: any): string {
    console.log('message1', { payload });
    return 'Hello world!';
  }

  @SubscribeMessage('message2')
  handleMessage2(client: any, payload: any): string {
    console.log('message2', { payload });
    this.server.emit('message', 'hi2');
    return 'Hello world!';
  }
}
