import { Game, PlayerId, transformGame } from '@monopoly/sdk';
import { MutationTree } from 'vuex';
import { GameState, getDefaultState } from './game.state';

export const mutations: MutationTree<GameState> = {
  resetState(state: GameState) {
    Object.assign(state, getDefaultState());
  },
  setGameId(state: GameState, id: string) {
    state.game.id = id;
  },
  setGame(state: GameState, game: Game) {
    state.game = transformGame(game);
  },
  setPlayerIndex(state: GameState, playerIndex: PlayerId) {
    state.playerIndex = playerIndex;
  },
  setCard(state: GameState, card: any | null) {
    state.card = card;
  },
  // TOOD: REMOVE
  increaseBankAmount(state: GameState) {
    state.game.bankAmount = (state.game.bankAmount ?? 0) + Math.floor(Math.random() * 300);
  },
  playerPosition(state: GameState, currentPositionIndex: number) {
    state.game.players[0].previousPositionIndex = state.game.players[0].currentPositionIndex;
    state.game.players[0].currentPositionIndex = currentPositionIndex;
  },
};
