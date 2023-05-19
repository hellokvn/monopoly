import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { ActionGateway } from './action.gateway';
import { ActionService } from './action.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [ActionGateway, ActionService],
})
export class ActionModule {}
