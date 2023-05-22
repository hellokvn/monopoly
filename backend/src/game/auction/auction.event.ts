import { Auction, BaseEvent } from '@monopoly/sdk';
import { OnEvent } from '@nestjs/event-emitter';

export class AuctionCreatedEvent extends BaseEvent {
  public readonly auction: Auction;

  constructor(gameId: string, auction: Auction) {
    super(gameId);

    this.auction = auction;
  }

  @OnEvent(AuctionCreatedEvent.name, { async: true })
  private handleEvent(event: AuctionCreatedEvent) {
    // handle and process "AuctionCreatedEvent" event
  }
}
