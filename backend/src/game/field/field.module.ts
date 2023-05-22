import { Module, forwardRef } from '@nestjs/common';
import { GameModule } from '../game.module';
import { FieldGateway } from './field.gateway';
import { FieldService } from './field.service';

@Module({
  imports: [forwardRef(() => GameModule)],
  providers: [FieldGateway, FieldService],
})
export class FieldModule {}
