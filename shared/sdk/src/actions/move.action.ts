import { Action } from './base.action';

export class MoveAction extends Action {
  public readonly value: number;
  public readonly isPositive: boolean;

  constructor(text: string, value: number, isPositive: boolean) {
    super(text);

    this.value = value;
    this.isPositive = isPositive;
  }
}
