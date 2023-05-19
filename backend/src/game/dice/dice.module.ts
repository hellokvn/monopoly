import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { DiceGateway } from './dice.gateway';
import { DiceService } from './dice.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [DiceGateway, DiceService],
})
export class DiceModule {}
