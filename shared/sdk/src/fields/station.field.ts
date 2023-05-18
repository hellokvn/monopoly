import { Field } from './base.field';

export class StationField extends Field {
  public readonly rentMatrix: number[];
  public readonly price: number;

  constructor(name: string) {
    super(name);

    this.isBuyable = true;
    this.isBuildable = false;
    this.familyIndex = 2;
    this.price = 2500;
    this.rentMatrix = [0, 1, 2, 3, 4];
  }
}
