import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from '../game.schema';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { GameModule } from '../game.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), forwardRef(() => GameModule)],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
