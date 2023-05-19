import { Field } from '../base/base.field';
import { FieldFamily } from '../field.enum';

export class FactoryField extends Field {
  constructor(id: number, name: string, family: FieldFamily) {
    super(id, name, family);

    this.isBuildable = false;
    this.price = 2500;
  }
}
