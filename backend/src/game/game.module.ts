import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.schema';
import { GameService } from './game.service';
import { GameSchedule } from './game.schedule';
import { ActionModule } from './action/action.module';
import { AuctionModule } from './auction/auction.module';
import { BuyModule } from './buy/buy.module';
import { ChatModule } from './chat/chat.module';
import { DeptsModule } from './depts/depts.module';
import { DiceModule } from './dice/dice.module';
import { FieldModule } from './field/field.module';
import { RentModule } from './rent/rent.module';
import { TradeModule } from './trade/trade.module';
import { GameHelper } from './game.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    ActionModule,
    AuctionModule,
    BuyModule,
    ChatModule,
    DeptsModule,
    DiceModule,
    FieldModule,
    RentModule,
    TradeModule,
  ],
  providers: [GameGateway, GameService, GameSchedule, GameHelper],
  exports: [GameHelper],
})
export class GameModule {}
