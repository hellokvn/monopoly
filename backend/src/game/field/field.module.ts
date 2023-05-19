import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { TradeGateway } from './field.gateway';
import { TradeService } from './field.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [TradeGateway, TradeService],
})
export class TradeModule {}
