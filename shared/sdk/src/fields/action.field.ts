import { Field } from './base.field';

export class ActionField extends Field {
  constructor(name: string) {
    super(name);

    this.familyIndex = 1;
  }
}
