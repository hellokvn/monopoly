import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from '../game.module';
import { Game, GameSchema } from '../game.schema';
import { JailGateway } from './jail.gateway';
import { JailService } from './jail.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), forwardRef(() => GameModule)],
  providers: [JailGateway, JailService],
})
export class JailModule {}
