import { Field } from './base.field';

export class StreetField extends Field {
  public readonly rentMatrix: number[];
  public readonly price: number;
  public readonly upgradePrice: number;
  public houses: number;

  constructor(name: string, familyIndex: number, price: number, rentMatrix: number[], upgradePrice: number) {
    super(name);

    this.isBuyable = true;
    this.isBuildable = true;
    this.familyIndex = familyIndex;
    this.houses = 0;
    this.price = price;
    this.rentMatrix = rentMatrix;
    this.upgradePrice = upgradePrice;
  }
}
