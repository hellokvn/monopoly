import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { GameHelper } from '../game.helper';

@Injectable()
export class DeptsService {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public async create(client: Socket): Promise<void> {
    console.log('DeptsService/create');
  }
}
