export class Field {
  public readonly name: string;
  public isBuyable: boolean;
  public isBuildable: boolean;
  public familyIndex: number;
  public type: string;

  constructor(name: string) {
    this.name = name;
    this.isBuyable = false;
    this.isBuildable = false;
    this.familyIndex = 0;
    this.type = typeof this;
  }
}
