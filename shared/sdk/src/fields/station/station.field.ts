import { Field } from '../base/base.field';
import { FieldFamily } from '../field.enum';

export class StationField extends Field {
  public readonly rentMatrix: number[];

  constructor(id: number, name: string, family: FieldFamily) {
    super(id, name, family);

    this.isBuildable = false;
    this.price = 2500;
    this.rentMatrix = [0, 1, 2, 3, 4];
  }
}
