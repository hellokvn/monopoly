import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
