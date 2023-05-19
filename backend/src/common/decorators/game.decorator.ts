import { WsException } from '@nestjs/websockets';
import { Game, GameField, GameStatus, Player, PlayerStatus } from '../../game/game.schema';
import { plainToClass } from 'class-transformer';
import { Document } from '../types/mongoose.type';

export const GAME_WAITING = 'game-waiting';
export const GAME_SET_ORDER = 'game-set-order';
export const GAME_STARTED = 'game-started';
export const PLAYER_TURN = 'player-turn';
export const PLAYER_ALIVE = 'player-alive';

type GamePermission = Array<typeof GAME_WAITING | typeof GAME_SET_ORDER | typeof GAME_STARTED | typeof PLAYER_TURN | typeof PLAYER_ALIVE>;

interface GameOpts {
  clientIndex?: number;
  payloadIndex?: number;
}

// TODO: Works only if one active game by client
function getGameByRoom(rooms: Set<string>): string | undefined {
  for (const room of rooms) {
    if (room.includes('GAME-')) {
      return room.replace('GAME-', '');
    }
  }
}

export const GetGame =
  (permissions: GamePermission = []) =>
  (target, key, descriptor) => {
    const originalFunction: any = descriptor.value;
    descriptor.value = async function (this: any) {
      if (!arguments || !arguments.length) {
        throw new WsException('No arguments found.');
      }

      const client = arguments[0];
      const payload = arguments[1];
      const game = await this.model.findById(payload.gameId).exec();

      if (!game) {
        throw new WsException('No game found.');
      }

      if (permissions.includes(GAME_WAITING) && game.status !== GameStatus.Waiting) {
        throw new WsException(`Game status is wrong. (${game.status})`);
      }

      client.game = game;

      return originalFunction.apply(this, arguments);
    };

    return descriptor;
  };

export const GetGameAndValidatePlayer =
  (permissions: GamePermission = [], opts: GameOpts = {}) =>
  (target, key, descriptor) => {
    const originalFunction: any = descriptor.value;
    descriptor.value = async function (this: any) {
      if (!arguments || !arguments.length) {
        throw new WsException('No arguments found.');
      }

      console.log('GetGameAndValidatePlayer');

      const client = arguments[opts.clientIndex || 0];
      const gameId: string = getGameByRoom(client.rooms);
      const game: Document<Game> = await this.model.findById(gameId).exec();

      if (!game) {
        throw new WsException('No game found.');
      }

      game.logs = [];

      if (permissions.includes(GAME_SET_ORDER) && game.status !== GameStatus.SetOrder) {
        throw new WsException(`Game status is wrong. (${game.status})`);
      }

      if (permissions.includes(GAME_STARTED) && game.status !== GameStatus.Started) {
        throw new WsException(`Game status is wrong. (${game.status})`);
      }

      const playerIndex = game.players.findIndex(({ clientId }) => clientId === client.id);

      if (playerIndex === -1) {
        throw new WsException('No player found.');
      }

      for (let index = 0; index < game.players.length; index++) {
        game.players[index] = plainToClass(Player, game.players[index]);
      }

      for (let index = 0; index < game.players.length; index++) {
        game.fields[index] = plainToClass(GameField, game.fields[index]);
      }

      const player: Player = game.players[playerIndex];

      if (permissions.includes(PLAYER_ALIVE) && player.status !== PlayerStatus.Alive) {
        throw new WsException('Player is not alive.');
      }

      if (permissions.includes(PLAYER_TURN) && player.index !== game.currentPlayerIndex) {
        throw new WsException('Another players turn.');
      }

      client.game = game;
      client.player = player;

      return originalFunction.apply(this, arguments);
    };

    return descriptor;
  };
