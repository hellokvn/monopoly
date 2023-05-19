import { Field } from '../base/base.field';
import { FieldFamily } from '../field.enum';

export class ActionField extends Field {
  constructor(index: number, name: string, familyIndex: FieldFamily) {
    super(index, name, familyIndex);
  }
}
