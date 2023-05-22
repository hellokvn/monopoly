import { Module } from '@nestjs/common';
import { ActionModule } from './action/action.module';
import { AuctionModule } from './auction/auction.module';
import { BuyModule } from './buy/buy.module';
import { ChatModule } from './chat/chat.module';
import { DeptsModule } from './depts/depts.module';
import { DiceModule } from './dice/dice.module';
import { FieldModule } from './field/field.module';
import { GameGateway } from './game.gateway';
import { GameHelper } from './game.helper';
import { GameSchedule } from './game.schedule';
import { GameService } from './game.service';
import { JailModule } from './jail/jail.module';
import { RentModule } from './rent/rent.module';
import { TradeModule } from './trade/trade.module';

@Module({
  imports: [ActionModule, AuctionModule, BuyModule, ChatModule, DeptsModule, DiceModule, FieldModule, JailModule, RentModule, TradeModule],
  providers: [GameGateway, GameService, GameSchedule, GameHelper],
  exports: [GameHelper],
})
export class GameModule {}
