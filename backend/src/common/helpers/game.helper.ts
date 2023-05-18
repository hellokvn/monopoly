import { Game, Player } from '../../game/game.schema';
import { Document } from '../types/mongoose.type';

export function saveGame(game: Document<Game>, player?: Player): Promise<Game> {
  if (player) {
    game.players[player.index] = player;
  }

  return game.save();
}
