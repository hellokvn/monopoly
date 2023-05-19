import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { RentGateway } from './rent.gateway';
import { RentService } from './rent.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }])],
  providers: [RentGateway, RentService],
})
export class RentModule {}
