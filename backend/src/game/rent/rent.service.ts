import { GameHelper } from '@/game/game.helper';
import { ALL_FIELDS, FACTORY_IDS, FactoryField, STATION_IDS, StationField, StreetField } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Game } from '../game.schema';

@Injectable()
export class RentService {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public payRent({ game, player }: Socket): Promise<Game> {
    const field = ALL_FIELDS[game.currentFieldIndex];
    const fieldData = game.fields[game.currentFieldIndex];
    const owner = game.players[fieldData.ownedByPlayerIndex];

    if (!owner) {
      throw new WsException('Field has no owner.');
    } else if (player.index === owner.index) {
      throw new WsException('Can not pay rent for own field.');
    } else if (owner.isJailed) {
      throw new WsException('Can not pay, owner is in jail.');
    }

    let rentToPay: number = 0;

    if (field instanceof StreetField) {
      rentToPay = field.rentMatrix[fieldData.houses];
    }

    if (field instanceof StationField) {
      let ownedStationsByOwner = 0;

      for (let fieldIndex of STATION_IDS) {
        const data = game.fields[fieldIndex];

        if (data.ownedByPlayerIndex === owner.index && data.houses === -1) {
          ownedStationsByOwner++;
        }
      }

      if (ownedStationsByOwner === 1) {
        rentToPay = Math.trunc((player.money * 5) / 100);
      } else if (ownedStationsByOwner === 2) {
        rentToPay = Math.trunc((player.money * 10) / 100);
      } else if (ownedStationsByOwner === 3) {
        rentToPay = Math.trunc((player.money * 15) / 100);
      } else if (ownedStationsByOwner === 4) {
        rentToPay = Math.trunc((player.money * 30) / 100);
      }
    }

    if (field instanceof FactoryField) {
      let ownedFactoriesByOwner = 0;
      let ownedFieldsByPlayer = 0;

      for (let fieldIndex of FACTORY_IDS) {
        const data = game.fields[fieldIndex];

        if (data.ownedByPlayerIndex === owner.index && data.houses === -1) {
          ownedFactoriesByOwner++;
        }
      }

      game.fields.forEach((f) => {
        if (f.ownedByPlayerIndex === player.index) {
          ownedFieldsByPlayer++;
        }
      });

      rentToPay = ownedFactoriesByOwner < FACTORY_IDS.length ? ownedFieldsByPlayer * 150 : ownedFieldsByPlayer * 350;
    }

    // TODO: Set rentToPay

    return this.gameHelper.saveGame(game, { player });
  }
}
