import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { RentService } from './rent.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class RentGateway {
  @Inject(RentService)
  private readonly service: RentService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('rent/pay')
  public async payRent(client: Socket): Promise<void> {
    await this.service.payRent(client);
  }
}
