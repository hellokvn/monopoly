import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateAuctionByOfferDto } from './auction.dto';
import { AuctionService } from './auction.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class AuctionGateway {
  @Inject(AuctionService)
  private readonly service: AuctionService;

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
