import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game, GameStatus, Player } from './game.schema';
import { GameHelper } from './game.helper';

@Injectable()
export class GameService {
  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @Inject(GameHelper)
  private readonly helper: GameHelper;

  public async create(client: Socket): Promise<void> {
    // TODO: Check if the creator player has an active room already.

    const game = new this.model();

    game.creatorClientId = client.id;

    client.game = await game.save();
  }

  public async join(client: Socket): Promise<Game | never> {
    const { game } = client;

    if (game.players.length >= 4) {
      throw new WsException('Too many players.');
    }

    const playerHasAlreadyJoined = game.players.findIndex(({ clientId }) => clientId === client.id) !== -1;

    if (playerHasAlreadyJoined) {
      throw new WsException('Player already joined this game.');
    }

    const player = new Player();
    player.index = game.players.length;
    player.clientId = client.id;
    player.name = `Player ${player.index}`;

    game.players.push(player);

    // TODO: For tests
    if (game.players.length >= 2) {
      game.status = GameStatus.SetOrder;
    }

    client.join(`GAME-${client.game._id.toString()}`);

    return this.helper.saveGame(game);
  }
}
