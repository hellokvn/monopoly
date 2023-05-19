import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { isSet, saveGame } from '@/common/helpers/game.helper';
import { ALL_FIELDS, FAMILY_STREET_IDS } from '@monopoly/sdk';

@Injectable()
export class BuyService {
  public buy({ game, player }: Socket): Promise<Game> {
    const field = ALL_FIELDS[player.currentPositionIndex];
    const fieldData = game.fields[player.currentPositionIndex];
    const isBuyable = isSet(fieldData.ownedByPlayerIndex) && field.isBuyable;

    if (isBuyable) {
      game.currentPlayerIndex = 1;

      return saveGame(game, player);
    }

    const canPay = player.canPay(field.price);

    if (!canPay) {
      // TODO: Create Auction to all players
      return;
    }

    player.decreaseMoney(field.price);
    fieldData.ownedByPlayerIndex = player.index;
    game.logs.push(`${player.name} buys ${field.name} for ${field.price} Gold.`);

    const hasFullStreet = game.hasFullStreet(player, field.family);

    if (hasFullStreet) {
      const familyFields: number[] = FAMILY_STREET_IDS[field.family];

      familyFields.forEach((index) => {
        const data = game.fields[index];

        data.hasFullStreet = true;
      });
    }

    return saveGame(game, player);
  }
}
