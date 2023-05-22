import { Game, Player } from '@monopoly/sdk';
import 'socket.io';

declare module 'socket.io' {
  interface Socket {
    game: Game;
    player: Player;
  }
}
