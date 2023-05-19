import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Game, GameStatus } from '../game.schema';
import { saveGame } from '@/common/helpers/game.helper';
import { Dice } from '@monopoly/sdk';

@Injectable()
export class DiceService {
  public diceToMove({ game, player }: Socket): Promise<Game> {
    const dice = new Dice();

    player.move(dice);
    game.currentFieldIndex = player.currentPositionIndex;

    return saveGame(game, player);
  }

  public diceToSetOrder({ game, player }: Socket): Promise<Game> {
    console.log('diceToSetOrder', { game });
    const { total } = new Dice();
    let isTaken = false;
    let isDone = true;

    game.players.forEach(({ index, orderDice }) => {
      if (index !== player.index) {
        if (orderDice === total) {
          isTaken = true;
        } else if (!orderDice) {
          isDone = false;
        }
      }
    });

    if (!isTaken) {
      player.orderDice = total;
      game.currentPlayerIndex = game.currentPlayerIndex + 1;
    }

    if (isDone) {
      game.status = GameStatus.Started;
      game.order = [0];
      game.currentPlayerIndex = game.order[0];
    }

    return saveGame(game, player);
  }
}
