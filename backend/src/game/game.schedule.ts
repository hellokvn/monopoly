import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GameSchedule {
  private readonly logger = new Logger(GameSchedule.name);

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // public handleCron() {
  //   this.logger.debug('Called when the current second is 10');
  // }
}
