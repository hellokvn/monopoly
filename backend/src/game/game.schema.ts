import { Dice } from '@monopoly/sdk';
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
  public diceCount = 0;
  public afkCount = 0;
  public bonuses = [0, 0, 0];
  public orderDice = 0;

  public move(dice: Dice): void {
    if (dice.isSame) {
      this.diceCount = this.diceCount + 1;
    } else {
      this.canDiceCount = 0;
    }

    this.currentPositionIndex = this.currentPositionIndex + dice.total;
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

  public logs: string[] = [];

  public getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
}

export const GameSchema = SchemaFactory.createForClass(Game);
