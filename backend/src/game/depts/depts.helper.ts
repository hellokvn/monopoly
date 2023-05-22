import { ALL_FIELDS, Game, Player, PlayerDeptsType, StreetField } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { GameHelper } from '../game.helper';

@Injectable()
export class DeptsHelper {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public pledgeFields(game: Game, player: Player): boolean {
    const pledgeableFields = game.getPledgeableFieldsByPlayer(player.index);

    if (!pledgeableFields || !pledgeableFields.length) {
      return player.canPayDepts;
    }

    pledgeableFields.forEach((fieldData) => {
      const field = ALL_FIELDS[fieldData.index];

      fieldData.pledge();
      player.increaseMoney(field.price / 2);

      if (player.canPayDepts) {
        return player.canPayDepts;
      }
    });

    return player.canPayDepts;
  }

  public removeHousesAndPledge(game: Game, player: Player): boolean {
    const builtFields = game.getBuiltFieldsByPlayer(player.index);

    if (!builtFields || !builtFields.length) {
      return player.canPayDepts;
    }

    builtFields.forEach((fieldData) => {
      const field = ALL_FIELDS[fieldData.index] as StreetField;

      for (let i = fieldData.houses; i > 0; i--) {
        fieldData.removeHouse();
        player.increaseMoney(field.downgradePrice);

        if (player.canPayDepts) {
          return player.canPayDepts;
        }
      }
    });

    return this.pledgeFields(game, player);
  }

  public payDepts(game: Game, player: Player): Player[] {
    const updatedPlayers: Player[] = [];
    const { depts } = player;

    player.decreaseMoney(depts.amount);

    if (depts.type === PlayerDeptsType.Bank) {
      game.increaseBankAmount(depts.amount);
      game.logs.push(`${player.name} pays his depts of ${depts.amount} Gold to bank.`);
    } else {
      const targetPlayer = game.players[depts.targetPlayerIndex];

      targetPlayer.increaseMoney(depts.amount);
      game.logs.push(`${player.name} pays his depts of ${depts.amount} Gold to ${targetPlayer.name}.`);

      updatedPlayers.push(targetPlayer);
    }

    player.decreaseMoney(depts.amount);
    depts.reset();

    return [player, ...updatedPlayers];
  }
}
