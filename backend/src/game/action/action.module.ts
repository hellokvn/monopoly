import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { ActionGateway } from './action.gateway';
import { ActionService } from './action.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [ActionGateway, ActionService],
})
export class ActionModule {}
