import { Game, Trade } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameHelper } from '../game.helper';
import { CreateTradeDto, TradeDto } from './trade.dto';
import { TradeStatus } from './trade.enum';
import { TradeHelper } from './trade.helper';

@Injectable()
export class TradeService {
  @Inject(TradeHelper)
  private readonly helper: TradeHelper;

  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public async create(client: Socket, payload: CreateTradeDto): Promise<void> {
    const { game, player } = client;
    const trade = new Trade();

    trade.playerIndex = player.index;
    trade.targetPlayerIndex = payload.targetPlayerIndex;
    trade.giveMoney = payload.giveMoney;
    trade.takeMoney = payload.takeMoney;
    trade.giveFields = payload.giveFields;
    trade.takeFields = payload.takeFields;

    this.helper.validateTrade(game, trade);

    game.trades.push(trade);

    const targetPlayer = game.players[payload.targetPlayerIndex];

    client.to(targetPlayer.clientId).emit('trade', trade);
  }

  public async accept(client: Socket, payload: TradeDto): Promise<Game> {
    const { game, player } = client;
    const trade = game.trades.find((trade) => trade.id === payload.tradeId && trade.status === TradeStatus.Active);

    if (!trade) {
      throw new WsException('No trade found.');
    }

    this.helper.validateTrade(game, trade);

    const targetPlayer = game.players[trade.targetPlayerIndex];

    trade.status = TradeStatus.Accepted;

    game.trades.push(trade);

    const logs = [`${targetPlayer.name} accepts ${player.name}s trade.`];

    // TODO: Add more logs of what players gets

    if (trade.giveMoney > 0) {
      player.decreaseMoney(trade.giveMoney);
      targetPlayer.increaseMoney(trade.giveMoney);
    }

    if (trade.takeMoney > 0) {
      player.increaseMoney(trade.takeMoney);
      targetPlayer.decreaseMoney(trade.takeMoney);
    }

    trade.giveFields.forEach((fieldIndex) => {
      game.fields[fieldIndex].ownedByPlayerIndex = targetPlayer.index;
    });

    trade.takeFields.forEach((fieldIndex) => {
      game.fields[fieldIndex].ownedByPlayerIndex = player.index;
    });

    return this.gameHelper.saveGame(game, { logs, players: [player, targetPlayer] });
  }

  public async decline(client: Socket, payload: TradeDto): Promise<void> {
    const { game } = client;
    const trade = game.trades.find((trade) => trade.id === payload.tradeId && trade.status === TradeStatus.Active);

    if (!trade) {
      throw new WsException('No trade found.');
    }

    trade.status = TradeStatus.Declined;

    const targetPlayer = game.players[trade.targetPlayerIndex];

    client.to(targetPlayer.clientId).emit('trade', trade);
  }

  public async abort(client: Socket, payload: TradeDto): Promise<void> {
    const { game } = client;
    const trade = game.trades.find((trade) => trade.id === payload.tradeId && trade.status === TradeStatus.Active);

    if (!trade) {
      throw new WsException('No trade found.');
    }

    trade.status = TradeStatus.Aborted;

    const targetPlayer = game.players[trade.targetPlayerIndex];

    client.to(targetPlayer.clientId).emit('trade', trade);
  }
}
