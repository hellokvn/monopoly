import { BaseEvent } from '@monopoly/sdk';
import { OnEvent } from '@nestjs/event-emitter';
import { ObjectId } from 'mongoose';
import { Auction } from '../game.schema';

export class AuctionCreatedEvent extends BaseEvent {
  public readonly auction: Auction;

  constructor(gameId: ObjectId, auction: Auction) {
    super(gameId);

    this.auction = auction;
  }

  @OnEvent(AuctionCreatedEvent.name, { async: true })
  private handleEvent(event: AuctionCreatedEvent) {
    // handle and process "AuctionCreatedEvent" event
  }
}
