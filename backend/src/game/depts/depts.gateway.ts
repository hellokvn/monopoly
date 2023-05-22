import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { DeptsService } from './depts.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class DeptsGateway {
  @Inject(DeptsService)
  private readonly service: DeptsService;

  @SubscribeMessage('depts/manual')
  public async manual(client: Socket): Promise<void> {
    await this.service.manual(client);
  }

  @SubscribeMessage('depts/automatic')
  public async automatic(client: Socket): Promise<void> {
    await this.service.automatic(client);
  }
}
