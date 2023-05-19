import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game.schema';
import { GameService } from './game.service';
import { GameSchedule } from './game.schedule';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [GameGateway, GameService, GameSchedule],
})
export class GameModule {}
