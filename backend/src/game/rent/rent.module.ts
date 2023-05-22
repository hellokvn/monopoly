import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { RentGateway } from './rent.gateway';
import { RentService } from './rent.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [RentGateway, RentService],
})
export class RentModule {}
