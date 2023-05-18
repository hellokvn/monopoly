import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { Game, GameStatus, Player } from './game.schema';
import { saveGame } from '../common/helpers/game.helper';
import { Dice } from '@monopoly/sdk';

@Injectable()
export class GameService {
  @InjectModel(Game.name)
  private readonly model: Model<Game>;

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

    // TODO: Remove, this is just for seamless testing.
    if (game.players.length === 0) {
      game.creatorClientId = client.id;
    }

    const player = new Player();
    player.index = game.players.length;
    player.clientId = client.id;
    player.name = `Player ${player.index}`;

    game.players.push(player);

    if (game.players.length >= 2) {
      game.status = GameStatus.SetOrder;
    }

    return saveGame(game);
  }

  public diceToMove({ game, player }: Socket): Promise<Game> {
    const dice = new Dice();

    player.move(dice);

    return saveGame(game, player);
  }

  public diceToSetOrder({ game, player }: Socket): Promise<Game> {
    console.log('diceToSetOrder', { game });
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

    return saveGame(game, player);
  }
}
