export class GameField {
  public index: number;
  public houses: number;
  public ownedByPlayerIndex: number | null;

  constructor(index: number) {
    this.index = index;
    this.houses = 0;
    this.ownedByPlayerIndex = null;
  }

  public get canAddHouse(): boolean {
    return this.houses >= 0 || this.houses < 5;
  }

  public get canRemoveHouse(): boolean {
    return this.houses > 0;
  }

  public get canPledge(): boolean {
    return this.houses === 0;
  }

  public get canUnpledge(): boolean {
    return this.houses === -1;
  }

  public get isPledged(): boolean {
    return this.houses === -1;
  }

  public addHouse(): boolean {
    if (!this.canAddHouse) {
      return false;
    }

    this.houses = this.houses + 1;

    return true;
  }

  public removeHouse(): boolean {
    if (!this.canRemoveHouse) {
      return false;
    }

    this.houses = this.houses - 1;

    return true;
  }

  public pledge(): boolean {
    if (!this.canPledge) {
      return false;
    }

    this.houses = -1;

    return true;
  }

  public unpledge(): boolean {
    if (!this.canUnpledge) {
      return false;
    }

    this.houses = 0;

    return true;
  }
}
