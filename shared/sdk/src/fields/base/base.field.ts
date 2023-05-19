import { FieldFamily } from '../field.enum';

export class Field {
  public readonly index: number;
  public readonly name: string;
  public readonly family: FieldFamily;
  public isBuildable: boolean;
  public price: number | null;

  constructor(index: number, name: string, family: FieldFamily) {
    this.index = index;
    this.name = name;
    this.family = family;
    this.isBuildable = false;
    this.price = null;
  }

  public get isBuyable(): boolean {
    return this.price && this.price > 0;
  }
}
