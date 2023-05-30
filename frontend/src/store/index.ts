import { App } from 'vue';
import { Store, createStore } from 'vuex';
import GameModule, { GameState } from './game';

export interface State {
  game: GameState;
}

export default (app: App): Store<State> =>
  createStore({
    modules: {
      game: GameModule(app),
    },
  });
