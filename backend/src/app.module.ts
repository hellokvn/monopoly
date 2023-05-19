import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './shared/mongodb/mongoose-config.service';
import { GameModule } from './game/game.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.IS_DOCKER ? '.docker.env' : '.env',
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    ScheduleModule.forRoot(),
    GameModule,
  ],
})
export class AppModule {}
