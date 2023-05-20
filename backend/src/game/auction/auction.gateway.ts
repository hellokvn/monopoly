import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { CreateAuctionByOfferDto } from './auction.dto';
import { AuctionService } from './auction.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class AuctionGateway {
  @Inject(AuctionService)
  private readonly service: AuctionService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('auction/create')
  public async createByNotBuying(client: Socket): Promise<void> {
    await this.service.createByNotBuying(client);
  }

  @SubscribeMessage('auction/offer')
  public async offer(@ConnectedSocket() client: Socket, @MessageBody() payload: CreateAuctionByOfferDto): Promise<void> {
    await this.service.createByOffer(client, payload);
  }

  @SubscribeMessage('auction/bid')
  public async bid(client: Socket): Promise<void> {
    await this.service.bid(client);
  }
}
