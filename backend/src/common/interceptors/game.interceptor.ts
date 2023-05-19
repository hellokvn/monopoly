import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Socket } from 'socket.io';

@Injectable()
export class GameInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const client: Socket = ctx.switchToWs().getClient();

    console.log('');
    console.log('Client ID:', client.id);

    return next.handle().pipe(tap((responseData) => emitMessage(client, responseData)));
  }
}

function emitMessage(client: Socket, responseData?: unknown) {
  console.log(client.game);
  client.to(client.game._id.toString()).emit('update', client.game);
}
