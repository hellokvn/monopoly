import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { TradeGateway } from './trade.gateway';
import { TradeHelper } from './trade.helper';
import { TradeSchedule } from './trade.schedule';
import { TradeService } from './trade.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [TradeGateway, TradeService, TradeSchedule, TradeHelper],
})
export class TradeModule {}
