import { GAME_STARTED, GetGameAndValidatePlayer, PLAYER_ALIVE } from '@/common/decorators/game.decorator';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateTradeDto, TradeDto } from './trade.dto';
import { TradeService } from './trade.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class TradeGateway {
  @Inject(TradeService)
  private readonly service: TradeService;

  @SubscribeMessage('trade/create')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async create(@ConnectedSocket() client: Socket, @MessageBody() payload: CreateTradeDto): Promise<void> {
    await this.service.create(client, payload);
  }

  @SubscribeMessage('trade/accept')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async accept(client: Socket, @MessageBody() payload: TradeDto): Promise<void> {
    await this.service.accept(client, payload);
  }

  @SubscribeMessage('trade/decline')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async decline(client: Socket, @MessageBody() payload: TradeDto): Promise<void> {
    await this.service.decline(client, payload);
  }

  @SubscribeMessage('trade/abort')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE])
  public async abort(client: Socket, @MessageBody() payload: TradeDto): Promise<void> {
    await this.service.abort(client, payload);
  }
}
