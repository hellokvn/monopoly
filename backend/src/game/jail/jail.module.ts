import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { JailGateway } from './jail.gateway';
import { JailService } from './jail.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [JailGateway, JailService],
})
export class JailModule {}
