import { App } from 'vue';
import { Module } from 'vuex';
import { State } from '../..';
import createActions from './info.actions';
import { getters } from './info.getters';
import { mutations } from './info.mutations';
import { InfoState, state } from './info.state';

const createModule = (app: App): Module<InfoState, State> => {
  return {
    state,
    mutations,
    getters,
    actions: createActions(app.config.globalProperties.$socket),
    namespaced: true,
  };
};

export type { InfoState } from './info.state';
export default (app: App) => createModule(app);
