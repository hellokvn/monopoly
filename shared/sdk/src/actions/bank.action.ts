import { Action } from './base.action';

export class BankAction extends Action {
  public readonly value: number;
  public readonly isPositive: boolean;
  public readonly payByProperty: boolean;

  constructor(text: string, value: number, isPositive: boolean, payByProperty: boolean = false) {
    super(text);

    this.value = value;
    this.isPositive = isPositive;
    this.payByProperty = payByProperty;
  }
}
