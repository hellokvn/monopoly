import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { DiceGateway } from './dice.gateway';
import { DiceService } from './dice.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [DiceGateway, DiceService],
})
export class DiceModule {}
