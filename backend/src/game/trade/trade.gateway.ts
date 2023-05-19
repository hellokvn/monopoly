import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class TradeGateway {
  @Inject(TradeService)
  private readonly service: TradeService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('trade/create')
  public async create(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('trade/accept')
  public async accept(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('trade/decline')
  public async decline(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('trade/abort')
  public async abort(client: Socket): Promise<void> {
    await this.service.create(client);
  }
}
