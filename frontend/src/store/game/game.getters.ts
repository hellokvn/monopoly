import { ALL_FIELDS } from '@monopoly/sdk';
import { GetterTree } from 'vuex';
import { State } from '..';
import { GameState } from './game.state';

export const getters: GetterTree<GameState, State> = {
  getGame: ({ game }: GameState) => game,
  getCurrentPlayer: ({ game }: GameState) => game.players[game.currentPlayerIndex],
  getCurrentField: ({ game }: GameState) => ({ info: ALL_FIELDS[game.currentFieldIndex], data: game.fields[game.currentFieldIndex] }),
  getPlayer: ({ game, playerIndex }: GameState) => game.players[playerIndex as number],
  getPlayerByIndex: ({ game }: GameState) => {
    return (playerIndex: number) => game.players[playerIndex];
  },
  getFieldByIndex: ({ game }: GameState) => {
    return (fieldIndex: number) => game.fields[fieldIndex];
  },
  getPlayers: ({ game }: GameState) => game.players,
  getAwaitingAction: ({ game }: GameState) => game.awaitingAction,
  getCurrentCard: ({ game }: GameState) => game.currentCard,
  getCard: ({ card }: GameState) => card,
  getBankAmount: ({ game }: GameState) => game.bankAmount,
  getLogs: ({ game }: GameState) => game.logs,
};
