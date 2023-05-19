import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { DiceService } from './dice.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class DiceGateway {
  @Inject(DiceService)
  private readonly service: DiceService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('dice/order')
  public async diceToSetOrder(client: Socket): Promise<void> {
    await this.service.diceToSetOrder(client);
  }

  @SubscribeMessage('dice')
  public async diceToMove(client: Socket): Promise<void> {
    await this.service.diceToMove(client);
  }
}
