import { BaseEvent } from '@monopoly/sdk';
import { ObjectId } from 'mongoose';
import { Auction } from '../game.schema';

export class AuctionCreatedEvent extends BaseEvent {
  public readonly auction: Auction;

  constructor(gameId: ObjectId, auction: Auction) {
    super(gameId);

    this.auction = auction;
  }
}
