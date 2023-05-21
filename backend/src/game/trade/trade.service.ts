import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { GameHelper } from '../game.helper';
import { PlayerStatus } from '../game.schema';
import { CreateTradeDto, TradeDto } from './trade.dto';
import { Trade } from './trade.schema';

@Injectable()
export class TradeService {
  @InjectModel(Trade.name)
  private readonly model: Model<Trade>;

  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public async create(client: Socket, payload: CreateTradeDto): Promise<void> {
    const { game, player } = client;
    const targetPlayer = game.players[payload.targetPlayerIndex];

    if (targetPlayer.status !== PlayerStatus.Alive) {
      throw new WsException('Target player is not alive.');
    }

    // TODO: Check if players own fields
    // TODO: Check if field families has houses

    const playerCanPay = player.canPay(payload.giveMoney);

    if (!playerCanPay) {
      throw new WsException('Player can not pay.');
    }

    const targetPlayerCanPay = targetPlayer.canPay(payload.takeMoney);

    if (!targetPlayerCanPay) {
      throw new WsException('Target player can not pay.');
    }

    const trade = new this.model(game);

    trade.playerIndex = player.index;
    trade.targetPlayerIndex = targetPlayer.index;
    trade.giveMoney = payload.giveMoney;
    trade.takeMoney = payload.takeMoney;
    trade.giveFields = payload.giveFields;
    trade.takeFields = payload.takeFields;

    await trade.save();

    client.to(targetPlayer.clientId).emit('trade', trade);
  }

  public async accept({ game, player }: Socket, payload: TradeDto): Promise<void> {
    console.log('TradeService/create');
  }

  public async decline({ game, player }: Socket, payload: TradeDto): Promise<void> {
    console.log('TradeService/create');
  }

  public async abort({ game, player }: Socket, payload: TradeDto): Promise<void> {
    console.log('TradeService/create');
  }
}
