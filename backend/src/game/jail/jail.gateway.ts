import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { JailService } from './jail.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class JailGateway {
  @Inject(JailService)
  private readonly service: JailService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('jail/pay')
  public async pay(client: Socket): Promise<void> {
    await this.service.pay(client);
  }
}
