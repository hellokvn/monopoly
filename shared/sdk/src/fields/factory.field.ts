import { Field } from './base.field';

export class FactoryField extends Field {
  public readonly price: number;

  constructor(name: string) {
    super(name);

    this.isBuyable = true;
    this.isBuildable = false;
    this.familyIndex = 3;
    this.price = 2500;
  }
}
