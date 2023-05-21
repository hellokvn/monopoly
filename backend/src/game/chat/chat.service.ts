import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { ChatAddDto } from './chat.dto';

@Injectable()
export class ChatService {
  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  public async add(client: Socket, { message }: ChatAddDto): Promise<void> {
    console.log('ChatService/add');
    const { game, player } = client;

    client.to(game._id.toString()).emit('chat', { message, from: player.name });
  }
}
