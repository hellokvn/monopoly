import { Document } from '@/common/types/mongoose.type';
import { Game, Player, PlayerStatus } from '@/game/game.schema';
import { BaseEvent } from '@monopoly/sdk';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface SaveGameOptions<T extends BaseEvent> {
  event?: { name: string; event: T };
  player?: Player;
  players?: Player[];
  setNextPlayer?: boolean;
}

@Injectable()
export class GameHelper {
  private readonly eventEmitter: EventEmitter2;

  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

  public saveGame<T extends BaseEvent>(game: Document<Game>, opts: SaveGameOptions<T> = {}): Promise<Game> {
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

    return game.save();
  }

  public moveActorByForce(
    game: Document<Game>,
    player: Player,
    value: number,
    isMerge: boolean = true,
    isForward: boolean = true,
  ): Game | Promise<Game> {
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
