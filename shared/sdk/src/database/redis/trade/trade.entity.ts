import { v1 } from 'uuid';
import { TRADE_TIMER } from './trade.constants';
import { TradeStatus } from './trade.enum';

export class Trade {
  public readonly id: string;
  public status: TradeStatus;
  public playerIndex: number;
  public targetPlayerIndex: number;
  public giveMoney: number;
  public takeMoney: number;
  public giveFields: number[];
  public takeFields: number[];
  public readonly createdAt: Date;
  public readonly expiredAt: Date;

  constructor() {
    this.id = v1();
    this.status = TradeStatus.Active;
    this.giveMoney = 0;
    this.takeMoney = 0;
    this.giveFields = [];
    this.takeFields = [];
    this.createdAt = new Date();
    this.expiredAt = new Date(new Date().getTime() + TRADE_TIMER);
  }
}
