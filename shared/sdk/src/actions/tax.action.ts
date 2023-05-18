import { Action } from './base.action';

export class TaxAction extends Action {
  public readonly values: number[];

  constructor(text: string, values: number[]) {
    super(text);

    this.values = values;
  }
}
