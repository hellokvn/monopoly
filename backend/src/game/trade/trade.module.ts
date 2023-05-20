import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { TradeGateway } from './trade.gateway';
import { TradeService } from './trade.service';
import { GameModule } from '../game.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), forwardRef(() => GameModule)],
  providers: [TradeGateway, TradeService],
})
export class TradeModule {}
