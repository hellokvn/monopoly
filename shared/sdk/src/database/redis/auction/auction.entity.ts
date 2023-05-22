import { AuctionType } from './auction.enum';

export class Auction {
  public type: AuctionType;
  public startingPrice: number;
  public price: number;
  public priceSteps: number;
  public fieldIndex: number;
  public bidder: number[];
  public offeredBy?: number;

  constructor(startingPrice: number) {
    this.bidder = [];
    this.startingPrice = startingPrice;
    this.price = startingPrice;
    this.priceSteps = this.startingPrice / 10;
  }
}
