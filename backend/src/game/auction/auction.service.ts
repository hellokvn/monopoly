import { ALL_FIELDS, Auction, AuctionType, FAMILY_STREET_IDS, Game } from '@monopoly/sdk';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { isSet } from 'util/types';
import { GameHelper } from '../game.helper';
import { CreateAuctionByOfferDto } from './auction.dto';
import { AuctionCreatedEvent } from './auction.event';

@Injectable()
export class AuctionService {
  @Inject(GameHelper)
  private readonly gameHelper: GameHelper;

  private readonly eventEmitter: EventEmitter2;

  constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

  public async createByNotBuying({ game, player }: Socket): Promise<void> {
    const field = ALL_FIELDS[player.currentPositionIndex];
    const fieldData = game.fields[field.index];

    if (game.auction) {
      throw new WsException('There is already an open auction.');
    } else if (!field.isBuyable || isSet(fieldData.ownedByPlayerIndex)) {
      throw new WsException('Field is not meant for auction.');
    }

    const auction = new Auction(field.price / 5);

    auction.type = AuctionType.Buy;
    auction.fieldIndex = field.index;

    game.auction = auction;

    const event = { name: AuctionCreatedEvent.name, event: new AuctionCreatedEvent(game.id, auction) };

    this.gameHelper.saveGame(game, { event });
  }

  public async createByOffer({ game, player }: Socket, { fieldIndex, startingPrice }: CreateAuctionByOfferDto): Promise<void> {
    const field = ALL_FIELDS[fieldIndex];
    const fieldData = game.fields[field.index];

    if (game.auction) {
      throw new WsException('There is already an open auction.');
    } else if (fieldData.ownedByPlayerIndex !== player.index) {
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

    auction.type = AuctionType.Offer;
    auction.priceSteps = auction.startingPrice / 10;
    auction.fieldIndex = field.index;

    game.auction = auction;

    this.gameHelper.saveGame(game);
  }

  public async createByDeath({ game, player }: Socket): Promise<Game> {
    const fields = game.fields.filter(({ ownedByPlayerIndex }) => ownedByPlayerIndex === player.index);

    fields.forEach((data) => {
      const field = ALL_FIELDS[data.index];
      const auction = new Auction(field.price);

      auction.type = AuctionType.Death;
      auction.priceSteps = auction.startingPrice / 10;
      auction.fieldIndex = field.index;

      game.auctionWaitlist.push(auction);
    });

    if (!game.auctionWaitlist || !game.auctionWaitlist.length) {
      this.gameHelper.saveGame(game);
      return;
    }

    game.auction = game.auctionWaitlist.shift();

    return this.gameHelper.saveGame(game);
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

  public async ends({ game }: Socket): Promise<void> {
    const { auction } = game;
    const field = ALL_FIELDS[auction.fieldIndex];
    const fieldData = game.fields[field.index];

    if (auction.bidder && auction.bidder.length) {
      const winnerPlayerIndex = auction.bidder[auction.bidder.length - 1];
      const winner = game.players[winnerPlayerIndex];
      const owner = game.players[fieldData.ownedByPlayerIndex];

      // TODO: do-while based on if winner can pay eventually

      winner.decreaseMoney(auction.price);

      if (auction.type === AuctionType.Offer) {
        owner.increaseMoney(auction.price);
      } else if (auction.type === AuctionType.Death) {
        game.increaseBankAmount(auction.price / 2);
      }

      winner.decreaseMoney(auction.price);
      fieldData.ownedByPlayerIndex = winner.index;
    }

    if (!game.auctionWaitlist || !game.auctionWaitlist.length) {
      this.gameHelper.saveGame(game);
      return;
    }

    game.auction = game.auctionWaitlist.shift();

    this.gameHelper.saveGame(game);
  }
}
