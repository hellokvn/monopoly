import { InjectModel } from '@nestjs/mongoose';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { DeptsService } from './depts.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class DeptsGateway {
  @Inject(DeptsService)
  private readonly service: DeptsService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('depts/manual')
  public async manual(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('depts/automatic')
  public async automatic(client: Socket): Promise<void> {
    await this.service.create(client);
  }
}
