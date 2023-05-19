import { InjectModel } from '@nestjs/mongoose';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { UseInterceptors, Inject, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import { TradeService } from './field.service';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { FieldDto } from './field.dto';
import { GAME_STARTED, PLAYER_ALIVE, GetGameAndValidatePlayer } from '@/common/decorators/game.decorator';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class TradeGateway {
  @Inject(TradeService)
  private readonly service: TradeService;

  @InjectModel(Game.name)
  private readonly model: Model<Game>;

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
