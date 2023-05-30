import { GetterTree } from 'vuex';
import { State } from '../..';
import { InfoState } from './info.state';

export const getters: GetterTree<InfoState, State> = {
  getInfo: (info: InfoState) => info,
  // getCurrentPlayer: ({ game }: GameState) => game.players[game.currentPlayerIndex],
  // getCurrentField: ({ game }: GameState) => ({ info: ALL_FIELDS[game.currentFieldIndex], data: game.fields[game.currentFieldIndex] }),
  // getPlayer: ({ game, playerIndex }: GameState) => game.players[playerIndex as number],
  // getPlayerByIndex: ({ game }: GameState, playerIndex: number) => game.players[playerIndex],
  // getPlayers: ({ game }: GameState) => game.players,
  // getAwaitingAction: ({ game }: GameState) => game.awaitingAction,
  // getCurrentCard: ({ game }: GameState) => game.currentCard,
  // getCard: ({ card }: GameState) => card,
  // getBankAmount: ({ game }: GameState) => game.bankAmount,
  // getLogs: ({ game }: GameState) => game.logs,
};
