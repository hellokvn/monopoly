import { Game, Player, PlayerStatus } from '@/game/game.schema';
import { Document } from '@/common/types/mongoose.type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface SaveGameOptions {
  setNextPlayer?: boolean;
}

@Injectable()
export class GameHelper {
  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  public saveGame(game: Document<Game>, players: Player[] = [], opts: SaveGameOptions = {}): Promise<Game> {
    if (players && players.length) {
      players.forEach((player) => {
        game.players[player.index] = player;
      });
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
        return this.saveGame(game, [player]);
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
