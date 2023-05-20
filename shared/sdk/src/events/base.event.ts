import { ObjectId } from 'mongoose';

export class BaseEvent {
  public readonly gameId: ObjectId;

  constructor(gameId: ObjectId) {
    this.gameId = gameId;
  }
}
