import { ALL_FIELDS, FAMILY_STREET_IDS, Game, PlayerStatus, Trade } from '@monopoly/sdk';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class TradeHelper {
  public validateTrade(game: Game, trade: Trade): void | never {
    const player = game.players[trade.playerIndex];

    if (player.status !== PlayerStatus.Alive) {
      throw new WsException('Player is not alive.');
    }

    const targetPlayer = game.players[trade.targetPlayerIndex];

    if (targetPlayer.status !== PlayerStatus.Alive) {
      throw new WsException('Target player is not alive.');
    }

    const playerCanPay = player.canPay(trade.giveMoney);

    if (!playerCanPay) {
      throw new WsException('Player can not pay.');
    }

    const targetPlayerCanPay = targetPlayer.canPay(trade.takeMoney);

    if (!targetPlayerCanPay) {
      throw new WsException('Target player can not pay.');
    }

    trade.giveFields.forEach((fieldIndex) => {
      const field = ALL_FIELDS[fieldIndex];
      const fieldData = game.fields[field.index];

      if (fieldData.ownedByPlayerIndex !== player.index) {
        throw new WsException(`Player does not own this field. (${field.index})`);
      }

      const familyFieldIndexes = FAMILY_STREET_IDS[field.family];

      familyFieldIndexes.forEach((familyFieldIndex) => {
        if (game.fields[familyFieldIndex].houses > 0) {
          throw new WsException(`One field family has built. (${field.index})`);
        }
      });
    });

    trade.takeFields.forEach((fieldIndex) => {
      const field = ALL_FIELDS[fieldIndex];
      const fieldData = game.fields[field.index];

      if (fieldData.ownedByPlayerIndex !== targetPlayer.index) {
        throw new WsException(`Player does not own this field. (${field.index})`);
      }

      const familyFieldIndexes = FAMILY_STREET_IDS[field.family];

      familyFieldIndexes.forEach((familyFieldIndex) => {
        if (game.fields[familyFieldIndex].houses > 0) {
          throw new WsException(`One field family has built. (${field.index})`);
        }
      });
    });
  }
}
