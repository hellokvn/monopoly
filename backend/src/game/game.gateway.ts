import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from './game.schema';
import { Inject, UsePipes, ValidationPipe, UseFilters, UseInterceptors } from '@nestjs/common';
import { GameService } from './game.service';
import { AllExceptionsFilter } from '../common/filters/exception.filter';
import { GAME_WAITING, GetGame } from '@/common/decorators/game.decorator';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class GameGateway {
  @Inject(GameService)
  private readonly service: GameService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('create')
  public async create(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('join')
  @GetGame([GAME_WAITING])
  public async join(client: Socket): Promise<void> {
    await this.service.join(client);
  }
}
