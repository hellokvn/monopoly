import { ALL_FIELDS } from '@monopoly/sdk';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsObject, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { TRADE_MAXIMUM_FIELDS, TRADE_MINIMUM_MONEY } from './trade.constants';

export class CreateTradeDto {
  @IsNumber()
  public targetPlayerIndex: number;

  @IsNumber()
  @Min(TRADE_MINIMUM_MONEY)
  public giveMoney: number = TRADE_MINIMUM_MONEY;

  @IsNumber()
  @Min(TRADE_MINIMUM_MONEY)
  public takeMoney: number = TRADE_MINIMUM_MONEY;

  @IsNumber(null, { each: true })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(TRADE_MAXIMUM_FIELDS)
  @Min(0)
  @Max(ALL_FIELDS.length)
  public giveFields: number[];

  @IsNumber(null, { each: true })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(TRADE_MAXIMUM_FIELDS)
  @Min(0)
  @Max(ALL_FIELDS.length)
  public takeFields: number[];
}

export class TradeDto {
  @IsObject()
  public tradeId: ObjectId;
}
