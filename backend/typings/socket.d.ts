import { Document } from 'src/common/types/mongoose.type';
import { Game, Player } from 'src/game/game.schema';
import 'socket.io';

declare module 'socket.io' {
  interface Socket {
    game: Document<Game>;
    player: Player;
  }
}
