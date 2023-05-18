import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createMongooseOptions(): MongooseModuleOptions {
    console.log(this.config.get('DB_URL'));
    return {
      uri: this.config.get('DB_URL'),
    };
  }
}
