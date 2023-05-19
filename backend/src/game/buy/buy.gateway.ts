import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { BuyService } from './buy.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class BuyGateway {
  @Inject(BuyService)
  private readonly service: BuyService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('buy')
  public async create(client: Socket): Promise<void> {
    await this.service.buy(client);
  }
}
