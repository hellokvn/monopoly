import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';

@Injectable()
export class AuctionService {
  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  public async create(client: Socket): Promise<void> {
    console.log('AuctionService/create');
  }
}
