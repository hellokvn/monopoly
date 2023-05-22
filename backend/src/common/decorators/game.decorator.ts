import { Game, GameField, GameStatus, Player, PlayerDepts, PlayerStatus, Trade } from '@monopoly/sdk';
import { WsException } from '@nestjs/websockets';
import { plainToClass } from 'class-transformer';
import { Redis } from 'ioredis';

export const GAME_WAITING = 'game-waiting';
export const GAME_SET_ORDER = 'game-set-order';
export const GAME_STARTED = 'game-started';
export const PLAYER_TURN = 'player-turn';
export const PLAYER_ALIVE = 'player-alive';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

function mapDataToGame(data: string | unknown): Game {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  const game = plainToClass(Game, data);

  // game.auction = plainToClass(Auction, game.auction) || null;

  game.trades.forEach((trade, index) => {
    game.trades[index] = plainToClass(Trade, trade);
  });

  game.fields.forEach((field, index) => {
    game.fields[index] = plainToClass(GameField, field);
  });

  game.players.forEach((player, index) => {
    game.players[index].depts = plainToClass(PlayerDepts, game.players[index].depts);
    game.players[index] = plainToClass(Player, player);
  });

  return game;
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
      if (!arguments || !arguments.length) {
        throw new WsException('No arguments found.');
      }

      const client = arguments[0];
      const payload = arguments[1];
      const game = mapDataToGame(await redis.get(payload.gameId));

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
      const game = mapDataToGame(await redis.get(gameId));

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

      console.log({ playerIndex, clientId: client.id });

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
