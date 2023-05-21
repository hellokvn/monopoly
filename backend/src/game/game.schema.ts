import { ALL_FIELDS, Bonus, Dice, FAMILY_STREET_IDS, FieldFamily, PlayerBonus } from '@monopoly/sdk';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GAME_DEFAULT_MONEY, GAME_STARTING_FIELD } from './game.constants';

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

  public get canPledge(): boolean {
    return this.houses === 0;
  }

  public get canUnpledge(): boolean {
    return this.houses === -1;
  }

  public get isPledged(): boolean {
    return this.houses === -1;
  }

  public addHouse(): boolean {
    if (!this.canAddHouse) {
      return false;
    }

    this.houses = this.houses + 1;

    return true;
  }

  public removeHouse(): boolean {
    if (!this.canRemoveHouse) {
      return false;
    }

    this.houses = this.houses - 1;

    return true;
  }

  public pledge(): boolean {
    if (!this.canPledge) {
      return false;
    }

    this.houses = -1;

    return true;
  }

  public unpledge(): boolean {
    if (!this.canUnpledge) {
      return false;
    }

    this.houses = 0;

    return true;
  }
}

function getFields(): GameField[] {
  const fields: GameField[] = [];

  ALL_FIELDS.forEach((field, index) => fields.push(new GameField(index)));

  return fields;
}

export enum PlayerDeptsType {
  Bank = 'bank',
  Player = 'player',
}

export class PlayerDepts {
  public amount: number;
  public type?: PlayerDeptsType;
  public targetPlayerIndex?: number;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.amount = 0;
    this.type = null;
    this.targetPlayerIndex = null;
  }
}

export class Player {
  public index: number;
  public clientId: string;
  public isBot: boolean;
  public name: string;
  public color: PlayerColor;
  public status: PlayerStatus;
  public money: number;
  public previousPositionIndex: number;
  public currentPositionIndex: number;
  public canDiceCount: number;
  public diceCounter: number;
  public afkCount: number;
  public bonuses: PlayerBonus;
  public orderDice: number;
  public isJailed: boolean;
  public depts: PlayerDepts;

  constructor() {
    this.isBot = false;
    this.money = GAME_DEFAULT_MONEY;
    this.status = PlayerStatus.Alive;
    this.previousPositionIndex = GAME_STARTING_FIELD;
    this.currentPositionIndex = GAME_STARTING_FIELD;
    this.canDiceCount = 0;
    this.diceCounter = 0;
    this.afkCount = 0;
    this.orderDice = 0;
    this.depts = new PlayerDepts();
    this.isJailed = false;
    this.bonuses = { [Bonus.Estate]: false, [Bonus.Gold]: false, [Bonus.JailFree]: false };
  }

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

  public get canPayDepts(): boolean {
    return this.money >= this.depts.amount;
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

  public increaseBankAmount(value: number): void {
    this.bankAmount = this.bankAmount + value;
  }

  public setBankAmount(value: number): void {
    this.bankAmount = value;
  }

  public getFieldsByPlayer(playerIndex: number): GameField[] {
    return this.fields.filter(({ ownedByPlayerIndex }) => ownedByPlayerIndex === playerIndex);
  }

  public getBuiltFieldsByPlayer(playerIndex: number): GameField[] {
    return this.fields.filter(({ ownedByPlayerIndex, houses }) => ownedByPlayerIndex === playerIndex && houses > 0);
  }

  public getPledgeableFieldsByPlayer(playerIndex: number): GameField[] {
    const fields = this.fields.filter(({ ownedByPlayerIndex, houses }) => ownedByPlayerIndex === playerIndex && houses === 0);
    const results: GameField[] = [];

    fields.forEach((data) => {
      const field = ALL_FIELDS[data.index];
      const familyStreets = FAMILY_STREET_IDS[field.family];
      let canPledge = true;

      familyStreets.forEach((familyFieldIndex) => {
        if (this.fields[familyFieldIndex].houses === 0) {
          canPledge = false;
        }
      });

      if (canPledge) {
        results.push(data);
      }
    });

    return fields;
  }
}

export const GameSchema = SchemaFactory.createForClass(Game);
