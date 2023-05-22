import { Game, PlayerStatus } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameHelper } from '../game.helper';
import { DeptsHelper } from './depts.helper';

@Injectable()
export class DeptsService {
  @Inject(DeptsHelper)
  private readonly helper: DeptsHelper;

  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public async manual(client: Socket): Promise<Game> {
    const { game, player } = client;

    if (!player.canPayDepts) {
      this.automatic(client);
    }

    const players = this.helper.payDepts(game, player);

    return this.gameHelper.saveGame(game, { players });
  }

  public async automatic({ game, player }: Socket): Promise<Game> {
    let canPayDepts = this.helper.pledgeFields(game, player);

    if (!canPayDepts) {
      canPayDepts = this.helper.removeHousesAndPledge(game, player);
    }

    if (!canPayDepts) {
      player.status = PlayerStatus.Dead;
      // TODO: Add game over logic
      return this.gameHelper.saveGame(game);
    }

    const players = this.helper.payDepts(game, player);

    return this.gameHelper.saveGame(game, { players });
  }
}
