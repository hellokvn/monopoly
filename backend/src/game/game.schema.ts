import { ALL_FIELDS, Bonus, Dice, FAMILY_STREET_IDS, FieldFamily, PlayerBonus } from '@monopoly/sdk';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

export enum GameStatus {
  Waiting = 'waiting',
  SetOrder = 'set-order',
  Started = 'started',
  Finished = 'finished',
  Aborted = 'aborted',
}

export enum GameActionStatus {
  Dice = 'dice',
  Auction = 'auction',
  Rent = 'rent',
  Buy = 'Buy',
}

export enum PlayerColor {
  Green = 'green',
  Blue = 'blue',
  Red = 'red',
  Yellow = 'yellow',
}

export enum PlayerStatus {
  Alive = 'alive',
  Dead = 'dead',
  Kicked = 'kicked',
  Disconnected = 'disconnected',
}

export class GameField {
  public index: number;
  public houses: number = 0;
  public ownedByPlayerIndex: number | null;
  public hasFullStreet: boolean = false;

  constructor(index: number) {
    this.index = index;
  }

  public get canAddHouse(): boolean {
    return this.houses >= 0 || this.houses < 5;
  }

  public get canRemoveHouse(): boolean {
    return this.houses > 0;
  }

  public get isPledged(): boolean {
    return this.houses === -1;
  }
}

function getFields(): GameField[] {
  const fields: GameField[] = [];

  ALL_FIELDS.forEach((field, index) => fields.push(new GameField(index)));

  return fields;
}

export class Player {
  public id: ObjectId;
  public index: number;
  public clientId: string;
  public isBot: boolean = false;
  public name: string;
  public color: PlayerColor;
  public status: PlayerStatus = PlayerStatus.Alive;
  public money = 15000;
  public previousPositionIndex: number = 0;
  public currentPositionIndex: number = 0;
  public canDiceCount = 0;
  public diceCounter = 0;
  public afkCount = 0;
  public bonuses: PlayerBonus = { [Bonus.Estate]: false, [Bonus.Gold]: false, [Bonus.JailFree]: false };
  public orderDice = 0;
  public isJailed = false;

  public move(dice: Dice): void {
    if (dice.isSame) {
      this.diceCounter = this.diceCounter + 1;

      if (this.diceCounter >= 3) {
        this.isJailed = true;
        this.currentPositionIndex = 12;
      } else {
        this.currentPositionIndex = this.currentPositionIndex + dice.total;

        return;
      }
    } else {
      this.canDiceCount = 0;
    }

    this.currentPositionIndex = this.currentPositionIndex + dice.total;
  }

  public canPay(value: number): boolean {
    return this.money - value >= 0;
  }

  public increaseMoney(value: number): void {
    this.money = this.money + value;
  }

  public decreaseMoney(value: number): void {
    this.money = this.money - value;
  }

  public getPercentOfMoney(percent: number) {
    return Math.trunc((this.money * percent) / 100);
  }

  public increasePosition(value: number) {
    let newPosition = this.currentPositionIndex + value;

    if (newPosition > ALL_FIELDS.length) {
      newPosition = newPosition - (ALL_FIELDS.length + 1);
    }

    this.setPosition(newPosition);
  }

  public decreasePosition(value: number) {
    let newPosition = this.currentPositionIndex - value;

    if (newPosition < 0) {
      newPosition = ALL_FIELDS.length + 1 + newPosition;
    }

    this.setPosition(newPosition);
  }

  public setPosition(position: number) {
    this.previousPositionIndex = this.currentPositionIndex;
    this.currentPositionIndex = position;
  }
}

export enum AuctionType {
  Buy = 'buy',
  Death = 'death',
  Offer = 'offer',
}

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

@Schema()
export class Game {
  @Prop({ required: true })
  public creatorClientId: string;

  @Prop({ required: true, default: GameStatus.Waiting })
  public status: GameStatus;

  @Prop({ required: true })
  public players: Player[];

  @Prop({ required: true, default: 0 })
  public rounds: number;

  @Prop({ required: true, default: 0 })
  public bankAmount: number;

  @Prop({ required: true, default: 0 })
  public currentPlayerIndex: number;

  // @Prop({ required: true, default: 0 })
  // public nextPlayerIndex: number;

  @Prop({ required: true, default: 0 })
  public currentFieldIndex: number;

  // @Prop({ required: true })
  // public currentAction: string;

  @Prop({ required: true, default: [] })
  public order: number[];

  @Prop({ required: true, default: getFields() })
  public fields: GameField[];

  @Prop()
  public auction: Auction | null;

  @Prop()
  public auctionWaitlist: Auction[];

  public logs: string[] = [];

  public hasFullStreet(player: Player, family: FieldFamily): boolean {
    const familyFields: number[] = FAMILY_STREET_IDS[family];
    let hasFullStreet: boolean = true;

    familyFields.forEach((index) => {
      const { ownedByPlayerIndex } = this.fields[index];

      if (ownedByPlayerIndex === player.index) {
        hasFullStreet = false;
      }
    });

    return hasFullStreet;
  }
}

export const GameSchema = SchemaFactory.createForClass(Game);
