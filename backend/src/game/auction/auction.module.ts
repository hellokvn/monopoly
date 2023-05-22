import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { AuctionGateway } from './auction.gateway';
import { AuctionService } from './auction.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [AuctionGateway, AuctionService],
})
export class AuctionModule {}
