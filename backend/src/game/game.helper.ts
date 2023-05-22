import { BaseEvent, Game, Player, PlayerStatus } from '@monopoly/sdk';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface SaveGameOptions<T extends BaseEvent> {
  event?: { name: string; event: T };
  player?: Player;
  players?: Player[];
  logs?: string[];
  setNextPlayer?: boolean;
}

@Injectable()
export class GameHelper {
  @InjectRedis()
  private readonly redis: Redis;

  private readonly eventEmitter: EventEmitter2;

  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

  public async saveGame<T extends BaseEvent>(game: Game, opts: SaveGameOptions<T> = {}): Promise<Game> {
    if (opts.players && opts.players.length) {
      opts.players.forEach((player) => (game.players[player.index] = player));
    } else if (opts.player) {
      game.players[opts.player.index] = opts.player;
    }

    if (opts.setNextPlayer) {
      let lookingForNextPlayer = true;
      let nextPlayerIndex: number;

      do {
        const currentOrderIndex = game.order.findIndex((playerIndex) => playerIndex === game.currentPlayerIndex);
        nextPlayerIndex = currentOrderIndex + 1 > game.order.length - 1 ? 0 : game.currentPlayerIndex + 1;
        const player = game.players[nextPlayerIndex];

        if (player.status === PlayerStatus.Alive) {
          lookingForNextPlayer = false;
        }
      } while (lookingForNextPlayer);

      console.log({ previous: game.currentPlayerIndex });
      game.currentPlayerIndex = nextPlayerIndex;
      console.log({ nextPlayer: nextPlayerIndex });
    }

    if (opts.event) {
      this.eventEmitter.emit('auction.created', opts.event);
    }

    await this.redis.set(game.id, JSON.stringify(game));

    if (opts.logs) {
      game.logs = opts.logs;
    }

    return game;
  }

  public moveActorByForce(
    game: Game,
    player: Player,
    value: number,
    isMerge: boolean = true,
    isForward: boolean = true,
  ): Promise<Game> | Game {
    if (isMerge) {
      if (isForward) {
        player.increasePosition(value);
      } else {
        // TODO: Add field to tell frontend to move backwards
        player.decreasePosition(value);
      }
    } else {
      if (value === 12 && player.currentPositionIndex === 12) {
        return this.saveGame(game, { player });
      } else {
        player.setPosition(value);
      }
    }

    if (isForward) {
      // TODO: Check if players passes start to receive gold.
    }

    // TODO: Check next field

    return game;
  }
}
