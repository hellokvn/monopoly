import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { DeptsGateway } from './depts.gateway';
import { DeptsHelper } from './depts.helper';
import { DeptsService } from './depts.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [DeptsGateway, DeptsService, DeptsHelper],
})
export class DeptsModule {}
