import { ALL_FIELDS, FAMILY_STREET_IDS } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { isSet } from 'util/types';
import { GameHelper } from '../game.helper';
import { Auction, Game } from '../game.schema';
import { CreateAuctionByOfferDto } from './auction.dto';
import { AuctionCreatedEvent } from './auction.event';

@Injectable()
export class AuctionService {
  @InjectModel(Game.name)
  private readonly model: Model<Game>;

  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  private readonly eventEmitter: EventEmitter2;

  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

  public async createByNotBuying({ game, player }: Socket): Promise<void> {
    const field = ALL_FIELDS[player.currentPositionIndex];
    const fieldData = game.fields[field.index];

    if (!field.isBuyable || isSet(fieldData.ownedByPlayerIndex)) {
      throw new WsException('Field is not meant for auction.');
    }

    const auction = new Auction(field.price / 5);

    auction.reference = 'buy';
    auction.fieldIndex = field.index;

    game.auction = auction;

    const event = new AuctionCreatedEvent(game.id, auction);

    this.gameHelper.saveGame(game, { event });
  }

  public async createByOffer({ game, player }: Socket, { fieldIndex, startingPrice }: CreateAuctionByOfferDto): Promise<void> {
    const field = ALL_FIELDS[fieldIndex];
    const fieldData = game.fields[field.index];

    if (fieldData.ownedByPlayerIndex !== player.index) {
      throw new WsException('Player does not own this field.');
    }

    const familyFields: number[] = FAMILY_STREET_IDS[field.family];

    familyFields.forEach((index) => {
      const data = game.fields[index];

      if (data.houses > 0) {
        throw new WsException('Player has built houses on this family street.');
      }
    });

    const auction = new Auction(startingPrice);

    auction.reference = 'offer';
    auction.priceSteps = auction.startingPrice / 10;
    auction.fieldIndex = field.index;

    game.auction = auction;

    this.gameHelper.saveGame(game);
  }

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
