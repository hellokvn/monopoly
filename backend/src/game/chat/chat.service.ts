import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatAddDto } from './chat.dto';

@Injectable()
export class ChatService {
  public async add(client: Socket, { message }: ChatAddDto): Promise<void> {
    const { game, player } = client;

    client.to(game.id).emit('chat', { message, from: player.name });
  }
}
