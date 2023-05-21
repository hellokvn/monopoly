import { GameHelper } from '@/game/game.helper';
import { ALL_FIELDS, FAMILY_STREET_IDS, StreetField } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';
import { FieldDto } from './field.dto';

@Injectable()
export class FieldService {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public async add({ game, player }: Socket, { fieldIndex }: FieldDto): Promise<Game> {
    const field = ALL_FIELDS[fieldIndex];
    const fieldData = game.fields[fieldIndex];

    if (fieldData.ownedByPlayerIndex !== player.index) {
      throw new WsException('No permissions to build here.');
    } else if (!(field instanceof StreetField)) {
      throw new WsException('Can not build here.');
    } else if (!player.canPay(field.upgradePrice)) {
      throw new WsException('Not enough money.');
    }

    const familyFields: number[] = FAMILY_STREET_IDS[field.family];

    familyFields.forEach((index) => {
      const data = fieldData[index];

      if (data.ownedByPlayerIndex === player.index || data.houses < 0 || data.houses >= 5) {
        throw new WsException('Can not build here.');
      }
    });

    familyFields.forEach((index) => {
      const data = game.fields[index];

      if (data.ownedByPlayerIndex === player.index || data.houses < 0 || data.houses >= 5) {
        throw new WsException('Can not build here.');
      }
    });

    // TODO: Estate Bonus
    player.decreaseMoney(field.upgradePrice);
    fieldData.houses = fieldData.houses + 1;

    game.logs.push(`${player.name} adds a house on ${field.name}.`);

    return this.gameHelper.saveGame(game, { player });
  }

  public async remove({ game, player }: Socket, { fieldIndex }: FieldDto): Promise<Game> {
    const field = ALL_FIELDS[fieldIndex];
    const fieldData = game.fields[fieldIndex];
    const canBuild = fieldData.ownedByPlayerIndex === player.index && fieldData.houses <= 0 && field instanceof StreetField;

    if (!canBuild) {
      throw new WsException('Can not build here.');
    }

    const moneyBack = (field.upgradePrice * 80) / 100;

    player.increaseMoney(moneyBack);
    fieldData.houses = fieldData.houses - 1;

    game.logs.push(`${player.name} removes a house on ${field.name}.`);

    return this.gameHelper.saveGame(game, { player });
  }

  public async pledge({ game, player }: Socket, { fieldIndex }: FieldDto): Promise<Game> {
    const field = ALL_FIELDS[fieldIndex];
    const fieldData = game.fields[fieldIndex];
    const canPledge = fieldData.ownedByPlayerIndex === player.index && field.isBuyable && fieldData.houses === 0;

    if (!canPledge) {
      throw new WsException('Can not pledge here.');
    }

    const familyFields: number[] = FAMILY_STREET_IDS[field.family];

    familyFields.forEach((index) => {
      const data = game.fields[index];

      if (data.houses > 0) {
        throw new WsException('Can not build here.');
      }
    });

    player.increaseMoney(field.price / 2);
    fieldData.houses = -1;

    game.logs.push(`${player.name} pledges ${field.name}.`);

    return this.gameHelper.saveGame(game, { player });
  }

  public async unpledge({ game, player }: Socket, { fieldIndex }: FieldDto): Promise<Game> {
    const field = ALL_FIELDS[fieldIndex];
    const fieldData = game.fields[fieldIndex];
    const canUnpledge = fieldData.ownedByPlayerIndex === player.index && field.isBuyable && fieldData.houses === -1;

    if (!canUnpledge) {
      throw new WsException('Can not unpledge here.');
    }

    const pledgeValue = field.price / 2;
    const price = pledgeValue + (pledgeValue * 20) / 100;

    player.decreaseMoney(price);
    fieldData.houses = 0;

    game.logs.push(`${player.name} unpledges ${field.name}.`);

    return this.gameHelper.saveGame(game, { player });
  }
}
