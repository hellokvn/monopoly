export class Action {
  public readonly type: string;
  public readonly text: string;

  constructor(text: string) {
    this.type = typeof this;
    this.text = text;
  }
}
