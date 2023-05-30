import { App } from 'vue';
import { Module } from 'vuex';
import { State } from '..';
import createActions from './game.actions';
import { getters } from './game.getters';
import { mutations } from './game.mutations';
import { GameState, state } from './game.state';
import InfoModule from './info';
import OperationModule from './operation';

const createModule = (app: App): Module<GameState, State> => {
  return {
    state,
    mutations,
    getters,
    actions: createActions(app.config.globalProperties.$socket),
    namespaced: true,
    modules: {
      info: InfoModule(app),
      operation: OperationModule(app),
    },
  };
};

export type { GameState } from './game.state';
export default (app: App) => createModule(app);
