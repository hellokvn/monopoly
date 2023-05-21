import { Field } from '../base';
import { Street } from './street.constants';

export class StreetField extends Field {
  public readonly upgradePrice: number;
  public readonly rentMatrix: number[];

  constructor(index: number, street: Street, streetIndex: number) {
    super(index, `${street.name} ${streetIndex + 1}`, street.family);

    this.isBuildable = true;
    this.upgradePrice = street.upgradePrice;
    this.price = street.members[streetIndex].price;
    this.rentMatrix = street.members[streetIndex].rentMatrix;
  }

  public get downgradePrice(): number {
    return (this.upgradePrice * 80) / 100;
  }
}
