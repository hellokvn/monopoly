import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { Bonus } from '@monopoly/sdk';
import { GameHelper } from '../game.helper';

@Injectable()
export class ActionService {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public async action({ game, player }: Socket): Promise<Game> {
    // const field = ALL_FIELDS[player.currentPositionIndex];
    // const fieldData = game.fields[player.currentPositionIndex];

    switch (game.currentFieldIndex) {
      case 0:
        player.increaseMoney(2500);
        game.logs.push(`${player.name} receives 500 Gold extra.`);
        break;

      case 4:
        const tax = player.getPercentOfMoney(15);

        player.decreaseMoney(tax);
        game.bankAmount = game.bankAmount + tax / 2;
        game.logs.push(`${player.name} pays ${tax} Gold for tax.`);
        break;

      case 5:
        player.bonuses[Bonus.Gold] = true;
        game.logs.push(`${player.name} gets gold bonus.`);
        break;

      case 21:
        if (game.bankAmount) {
          break;
        }

        game.logs.push(`${player.name} receives ${game.bankAmount} Gold from bank.`);
        player.increaseMoney(game.bankAmount);
        game.bankAmount = 0;
        break;

      case 22:
        player.bonuses[Bonus.Estate] = true;
        game.logs.push(`${player.name} gets estate bonus.`);
        break;

      case 33:
        if (player.bonuses[Bonus.JailFree]) {
          player.bonuses[Bonus.JailFree] = false;
          game.logs.push(`${player.name} does not need to go to jail.`);
        } else {
          game.logs.push(`${player.name} needs to go to jail.`);
        }

        return this.gameHelper.moveActorByForce(game, player, 12, false);

      case 40:
        // TODO: Check if player can pay (money and property) otherwise player dies.
        break;

      default:
        break;
    }
  }
}
