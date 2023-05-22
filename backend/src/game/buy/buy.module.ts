import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { BuyGateway } from './buy.gateway';
import { BuyService } from './buy.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [BuyGateway, BuyService],
})
export class BuyModule {}
