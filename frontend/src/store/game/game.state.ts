import { Todo } from '@/common/types';
import { Game, PlayerId } from '@monopoly/sdk';

export interface GameState {
  game: Game;
  playerIndex: PlayerId | null;
  card: Todo | null;
}

export const getDefaultState = (): GameState => {
  return {
    game: {} as Game,
    playerIndex: null,
    card: null,
  };
};

export const state = (): GameState => getDefaultState();
