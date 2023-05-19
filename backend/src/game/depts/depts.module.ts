import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { DeptsGateway } from './depts.gateway';
import { DeptsService } from './depts.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [DeptsGateway, DeptsService],
})
export class DeptsModule {}
