import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Game } from '../game.schema';

const ONE_MINUTE: number = 60000;

export type TradeDocument = HydratedDocument<Trade>;

@Schema()
export class Trade {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
  public readonly game: Game;

  @Prop({ required: true })
  public playerIndex: number;

  @Prop({ required: true })
  public targetPlayerIndex: number;

  @Prop({ default: 0 })
  public giveMoney: number;

  @Prop({ default: 0 })
  public takeMoney: number;

  @Prop({ default: [] })
  public giveFields: number[];

  @Prop({ default: [] })
  public takeFields: number[];

  @Prop({ default: new Date() })
  public readonly createdAt: Date;

  @Prop({ default: new Date(new Date().getTime() + ONE_MINUTE) })
  public readonly expiresAt: Date;

  constructor(game: Game) {
    this.game = game;
  }
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
