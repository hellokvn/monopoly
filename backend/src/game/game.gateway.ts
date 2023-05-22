import { GAME_WAITING, GetGame, GetGameAndValidatePlayer } from '@/common/decorators/game.decorator';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { GameInterceptor } from '@/common/interceptors/game.interceptor';
import { Inject, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ namespace: 'game' })
@UseFilters(AllExceptionsFilter)
@UsePipes(new ValidationPipe())
@UseInterceptors(GameInterceptor)
export class GameGateway {
  @Inject(GameService)
  private readonly service: GameService;

  @SubscribeMessage('create')
  public async create(client: Socket): Promise<void> {
    await this.service.create(client);
  }

  @SubscribeMessage('join')
  @GetGame([GAME_WAITING])
  public async join(client: Socket): Promise<void> {
    await this.service.join(client);
  }

  @SubscribeMessage('test')
  @GetGameAndValidatePlayer()
  public async test(client: Socket): Promise<void> {
    await this.service.test(client);
  }

  @SubscribeMessage('rejoin')
  @GetGame()
  public async rejoin(client: Socket): Promise<void> {
    // await this.service.join(client);
  }
}
