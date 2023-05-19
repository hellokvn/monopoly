import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { TradeGateway } from './trade.gateway';
import { TradeService } from './trade.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [TradeGateway, TradeService],
})
export class TradeModule {}
