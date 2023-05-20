import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { AuctionGateway } from './auction.gateway';
import { AuctionService } from './auction.service';
import { GameModule } from '../game.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), forwardRef(() => GameModule)],
  providers: [AuctionGateway, AuctionService],
})
export class AuctionModule {}
