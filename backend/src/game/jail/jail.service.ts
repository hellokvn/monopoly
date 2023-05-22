import { Game } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameHelper } from '../game.helper';
import { JAIL_PAYOUT_PRICE } from './jail.constants';

@Injectable()
export class JailService {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public pay({ game, player }: Socket): Promise<Game> {
    const canPay = player.canPay(JAIL_PAYOUT_PRICE);

    if (!canPay) {
      // TODO: Force roll dice instead
      return this.gameHelper.saveGame(game);
    }

    player.decreaseMoney(JAIL_PAYOUT_PRICE);
    player.isJailed = false;

    game.logs.push(`${player.name} pays ${JAIL_PAYOUT_PRICE} Gold to be released.`);

    return this.gameHelper.saveGame(game);
  }
}
