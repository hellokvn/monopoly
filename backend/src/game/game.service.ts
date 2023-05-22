import { Game, GameStatus, Player } from '@monopoly/sdk';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameHelper } from './game.helper';

@Injectable()
export class GameService {
  @InjectRedis()
  private readonly redis: Redis;

  @Inject(GameHelper)
  private readonly helper: GameHelper;

  public async test(client: Socket): Promise<Game> {
    const { game, player } = client;

    player.name = 'Cool';

    return this.helper.saveGame(game);
  }

  public async create(client: Socket): Promise<void> {
    // TODO: Check if the creator player has an active room already.

    const game = new Game(client.id);

    await this.redis.set(game.id, JSON.stringify(game));

    console.log(game.id);

    client.game = game;
  }

  public async join(client: Socket): Promise<Game | never> {
    const { game } = client;

    if (game.players.length >= 4) {
      throw new WsException('Too many players.');
    }

    const playerHasAlreadyJoined = game.players.findIndex(({ clientId }) => clientId === client.id) !== -1;

    if (playerHasAlreadyJoined) {
      throw new WsException('Player already joined this game.');
    }

    const player = new Player(game.players.length);

    // TODO: Set userId (psql/auth)

    player.clientId = client.id;
    player.name = `Player ${player.index}`;

    game.players.push(player);

    // TODO: For tests
    if (game.players.length >= 2) {
      game.status = GameStatus.SetOrder;
    }

    client.join(client.game.id);

    return this.helper.saveGame(game);
  }
}
