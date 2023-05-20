import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { BuyGateway } from './buy.gateway';
import { BuyService } from './buy.service';
import { GameModule } from '../game.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), forwardRef(() => GameModule)],
  providers: [BuyGateway, BuyService],
})
export class BuyModule {}
