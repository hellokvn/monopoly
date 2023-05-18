import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    console.log('AllExceptionsFilter', { exception });
    const args = host.getArgs();
    const ACKCallback = args.pop();

    if (exception instanceof BadRequestException) {
      return ACKCallback(exception.getResponse());
    }

    if ('function' === typeof args[args.length - 1]) {
      return ACKCallback({ error: exception.message });
    }

    return ACKCallback(exception);
  }
}
