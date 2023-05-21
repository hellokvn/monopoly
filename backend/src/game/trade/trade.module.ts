import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from '../game.module';
import { Game, GameSchema } from '../game.schema';
import { TradeGateway } from './trade.gateway';
import { TradeHelper } from './trade.helper';
import { TradeSchedule } from './trade.schedule';
import { Trade, TradeSchema } from './trade.schema';
import { TradeService } from './trade.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: Trade.name, schema: TradeSchema },
    ]),
    forwardRef(() => GameModule),
  ],
  providers: [TradeGateway, TradeService, TradeSchedule, TradeHelper],
})
export class TradeModule {}
