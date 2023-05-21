import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class CreateTradeDto {
  @IsNumber()
  public targetPlayerIndex: number;

  @IsNumber()
  public giveMoney: number = 0;

  @IsNumber()
  public takeMoney: number = 0;

  @IsNumber(null, { each: true })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(4)
  public giveFields: number[];

  @IsNumber(null, { each: true })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(4)
  public takeFields: number[];
}

export class TradeDto {
  @IsNumber()
  public tradeId: number;
}
