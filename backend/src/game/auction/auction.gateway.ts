import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class AuctionGateway {
  @Inject(AuctionService)
  private readonly service: AuctionService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('auction/start')
  public async start(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('auction/offer')
  public async offer(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('auction/bid')
  public async bid(client: Socket): Promise<void> {
    await this.service.create(client);
  }
}
