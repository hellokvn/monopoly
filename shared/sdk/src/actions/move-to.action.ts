import { Action } from './base.action';

export class MoveToAction extends Action {
  public readonly fieldIndex: number;
  public readonly getMoneyByPassingStart: boolean;

  constructor(text: string, fieldIndex: number, getMoneyByPassingStart: boolean = true) {
    super(text);

    this.fieldIndex = fieldIndex;
    this.getMoneyByPassingStart = getMoneyByPassingStart;
  }
}
