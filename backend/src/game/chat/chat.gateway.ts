import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatAddDto } from './chat.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class ChatGateway {
  @Inject(ChatService)
  private readonly service: ChatService;

  @SubscribeMessage('chat/add')
  public async add(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatAddDto): Promise<void> {
    await this.service.add(client, payload);
  }
}
