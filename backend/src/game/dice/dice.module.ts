import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { DiceGateway } from './dice.gateway';
import { DiceService } from './dice.service';
import { GameModule } from '../game.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), forwardRef(() => GameModule)],
  providers: [DiceGateway, DiceService],
})
export class DiceModule {}
