import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { BuyGateway } from './buy.gateway';
import { BuyService } from './buy.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [BuyGateway, BuyService],
})
export class BuyModule {}
