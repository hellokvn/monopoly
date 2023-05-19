import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { AuctionGateway } from './auction.gateway';
import { AuctionService } from './auction.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [AuctionGateway, AuctionService],
})
export class AuctionModule {}
