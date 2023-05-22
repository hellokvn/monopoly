import { GAME_STARTED, GetGameAndValidatePlayer, PLAYER_ALIVE } from '@/common/decorators/game.decorator';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FieldDto } from './field.dto';
import { FieldService } from './field.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class FieldGateway {
  @Inject(FieldService)
  private readonly service: FieldService;

  @SubscribeMessage('field/add')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async add(@ConnectedSocket() client: Socket, @MessageBody() payload: FieldDto): Promise<void> {
    await this.service.add(client, payload);
  }

  @SubscribeMessage('field/remove')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async remove(@ConnectedSocket() client: Socket, @MessageBody() payload: FieldDto): Promise<void> {
    await this.service.remove(client, payload);
  }

  @SubscribeMessage('field/pledge')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async pledge(@ConnectedSocket() client: Socket, @MessageBody() payload: FieldDto): Promise<void> {
    await this.service.pledge(client, payload);
  }

  @SubscribeMessage('field/unpledge')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async unpledge(@ConnectedSocket() client: Socket, @MessageBody() payload: FieldDto): Promise<void> {
    await this.service.unpledge(client, payload);
  }
}
