import { ALL_FIELDS, Game, GameField, GameId, GameStatus, Player, PlayerStatus, isSet, transformGame } from '@monopoly/sdk';
import { WsException } from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { Redis } from 'ioredis';
import { Socket } from 'socket.io';

export const GAME_WAITING = 'game-waiting';
export const GAME_SET_ORDER = 'game-set-order';
export const GAME_STARTED = 'game-started';
export const PLAYER_TURN = 'player-turn';
export const PLAYER_ALIVE = 'player-alive';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

function mapDataToGame(data: string | unknown): Game | undefined {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (!data) {
    return;
  }

  return transformGame(data as Game);
}

type GamePermission = Array<typeof GAME_WAITING | typeof GAME_SET_ORDER | typeof GAME_STARTED | typeof PLAYER_TURN | typeof PLAYER_ALIVE>;

interface GameOpts {
  clientIndex?: number;
  payloadIndex?: number;
}

// TODO: Works only if one active game by client
function getGameByRoom(rooms: Set<string>): string | undefined {
  for (const room of rooms) {
    if (room.includes('GAME-')) {
      return room;
    }
  }
}

export const GetGame =
  (permissions: GamePermission = []) =>
  (target, key, descriptor) => {
    const originalFunction: any = descriptor.value;
    descriptor.value = async function (this: any) {
      // eslint-disable-next-line
      if (!arguments || !arguments.length) {
        throw new WsException('No arguments found.');
      }

      // eslint-disable-next-line
      const client = arguments[0];
      // eslint-disable-next-line
      const payload = arguments[1];
      console.log(payload);
      const game = mapDataToGame(await redis.get(payload.gameId));

      if (!game) {
        throw new WsException('No game found.');
      }

      if (permissions.includes(GAME_WAITING) && game.status !== GameStatus.Waiting) {
        throw new WsException(`Game status is wrong. (${game.status})`);
      }

      client.game = game;

      // eslint-disable-next-line
      return originalFunction.apply(this, arguments);
    };

    return descriptor;
  };

export const InitializeGame =
  (permissions: GamePermission = [], opts: GameOpts = {}) =>
  (target, key, descriptor) => {
    // eslint-disable-next-line
    const originalFunction: any = descriptor.value;

    descriptor.value = async function (this: any) {
      // eslint-disable-next-line
      if (!arguments || !arguments.length) {
        throw new WsException('No arguments found.');
      }

      // eslint-disable-next-line
      const client: Socket = arguments[opts.clientIndex || 0];
      const gameId: GameId = getGameByRoom(client.rooms);
      const game = mapDataToGame(await redis.get(gameId));

      if (!game) {
        throw new WsException('No game found.');
      }

      game.logs = [];
      game.diceData = null;

      if (permissions.includes(GAME_SET_ORDER) && game.status !== GameStatus.SetOrder) {
        throw new WsException(`Game status is wrong. (${game.status})`);
      }

      if (permissions.includes(GAME_STARTED) && game.status !== GameStatus.Started) {
        throw new WsException(`Game status is wrong. (${game.status})`);
      }

      const playerIndex = game.players.findIndex(({ clientId }) => clientId === client.id);

      if (!isSet(playerIndex)) {
        throw new WsException('No player found.');
      }

      for (let index = 0; index < game.players.length; index++) {
        game.players[index] = plainToClass(Player, game.players[index]);
      }

      for (let index = 0; index < game.players.length; index++) {
        game.fields[index] = plainToClass(GameField, game.fields[index]);
      }

      const player = game.players[playerIndex];

      if (permissions.includes(PLAYER_ALIVE) && player.status !== PlayerStatus.Alive) {
        throw new WsException('Player is not alive.');
      }

      if (permissions.includes(PLAYER_TURN) && player.index !== game.currentPlayerIndex) {
        throw new WsException('Another players turn.');
      }

      client.game = game;
      client.player = player;
      client.field = { info: ALL_FIELDS[game.currentFieldIndex], data: game.fields[game.currentFieldIndex] };

      // eslint-disable-next-line
      return originalFunction.apply(this, arguments);
    };

    return descriptor;
  };
