import { InjectModel } from '@nestjs/mongoose';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { ChatAddDto } from './chat.dto';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class ChatGateway {
  @Inject(ChatService)
  private readonly service: ChatService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @SubscribeMessage('chat/add')
  public async add(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatAddDto): Promise<void> {
    await this.service.add(client, payload);
  }
}
