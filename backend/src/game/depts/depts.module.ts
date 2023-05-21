import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from '../game.module';
import { Game, GameSchema } from '../game.schema';
import { DeptsGateway } from './depts.gateway';
import { DeptsHelper } from './depts.helper';
import { DeptsService } from './depts.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), forwardRef(() => GameModule)],
  providers: [DeptsGateway, DeptsService, DeptsHelper],
})
export class DeptsModule {}
