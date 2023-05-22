import { GAME_SET_ORDER, GAME_STARTED, GetGameAndValidatePlayer, PLAYER_ALIVE, PLAYER_TURN } from '@/common/decorators/game.decorator';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { DiceService } from './dice.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class DiceGateway {
  @Inject(DiceService)
  private readonly service: DiceService;

  @SubscribeMessage('order')
  @GetGameAndValidatePlayer([GAME_SET_ORDER, PLAYER_ALIVE, PLAYER_TURN])
  public async diceToSetOrder(client: Socket): Promise<void> {
    await this.service.diceToSetOrder(client);
  }

  @SubscribeMessage('dice')
  @GetGameAndValidatePlayer([GAME_STARTED, PLAYER_ALIVE, PLAYER_TURN])
  public async diceToMove(client: Socket): Promise<void> {
    await this.service.diceToMove(client);
  }
}
