import { ALL_FIELDS } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { isSet } from 'util/types';
import { GameHelper } from '../game.helper';
import { Auction, Game } from '../game.schema';

@Injectable()
export class AuctionService {
  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  public async createByNotBuying({ game, player }: Socket): Promise<void> {
    const field = ALL_FIELDS[player.currentPositionIndex];
    const fieldData = game.fields[field.index];

    if (!field.isBuyable || isSet(fieldData.ownedByPlayerIndex)) {
      throw new WsException('Field is not meant for auction.');
    }

    const auction = new Auction(field.price / 5);

    auction.reference = 'buy';
    auction.priceSteps = field.price / 10;
    auction.fieldIndex = field.index;

    game.auction = auction;

    this.gameHelper.saveGame(game);
  }

  public async offer({ game, player }: Socket): Promise<void> {}

  public async bid({ game, player }: Socket): Promise<void> {
    const { auction } = game;

    if (!auction) {
      throw new WsException('No auction found.');
    } else if (auction.offeredBy === player.index) {
      throw new WsException('Can not bid on your own auction.');
    }

    const canPay = player.canPay(auction.price);

    if (!canPay) {
      throw new WsException('Not enough money.');
    }

    const field = ALL_FIELDS[game.auction.fieldIndex];

    game.logs.push(`${player.name} bids ${auction.price} Gold for ${field.name}.`);

    auction.price = auction.price + auction.priceSteps;

    // TODO: Set timer

    this.gameHelper.saveGame(game);
  }

  public async ends({ game }: Socket): Promise<void> {}
}
