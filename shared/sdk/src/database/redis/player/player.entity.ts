import { Bonus, PlayerBonus } from '../../../bonus';
import { GAME_DEFAULT_MONEY, GAME_STARTING_FIELD } from '../../../constants/game.constants';
import { Dice } from '../../../dice';
import { ALL_FIELDS } from '../../../fields';
import { PlayerColor, PlayerDeptsType, PlayerStatus } from './player.enum';

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
  public readonly index: number;
  public readonly userId: string | null;
  public clientId: string | null;
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

  constructor(index: number, userId?: string) {
    this.index = index;
    this.userId = userId ?? null;
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
