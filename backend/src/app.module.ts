import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GameModule } from './game/game.module';
import { MongooseConfigService } from './shared/mongodb/mongoose-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.IS_DOCKER ? '.docker.env' : '.env',
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    GameModule,
  ],
})
export class AppModule {}
