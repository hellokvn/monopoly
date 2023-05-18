import { DICE_MINIMUM, DICE_MAXIMUM } from './dice.constants';
import { randomInt } from 'crypto';

export class Dice {
  public left: number;
  public right: number;
  public total: number;
  public isSame: boolean;

  constructor() {
    this.left = randomInt(DICE_MINIMUM, DICE_MAXIMUM);
    this.right = randomInt(DICE_MINIMUM, DICE_MAXIMUM);
    this.total = this.left + this.right;
    this.isSame = this.left === this.right;
  }
}
