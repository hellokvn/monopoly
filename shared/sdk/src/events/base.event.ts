export class BaseEvent {
  public readonly gameId: string;

  constructor(gameId: string) {
    this.gameId = gameId;
  }
}
