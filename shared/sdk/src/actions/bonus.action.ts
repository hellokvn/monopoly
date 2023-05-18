import { Action } from './base.action';

export class BonusAction extends Action {
  public readonly bonus: number;

  constructor(text: string, bonus: number) {
    super(text);

    this.bonus = bonus;
  }
}
