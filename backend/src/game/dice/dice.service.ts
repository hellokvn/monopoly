import { Dice } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameHelper } from '../game.helper';
import { Game, GameStatus } from '../game.schema';

@Injectable()
export class DiceService {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public diceToMove({ game, player }: Socket): Promise<Game> {
    const dice = new Dice();

    player.move(dice);
    game.currentFieldIndex = player.currentPositionIndex;

    const setNextPlayer = !dice.isSame || player.isJailed;

    return this.gameHelper.saveGame(game, { player, setNextPlayer });
  }

  public diceToSetOrder({ game, player }: Socket): Promise<Game> {
    console.log('diceToSetOrder', { game, player });
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
      game.order = [0, 1];
      game.currentPlayerIndex = game.order[0];
    }

    return this.gameHelper.saveGame(game, { player });
  }
}
