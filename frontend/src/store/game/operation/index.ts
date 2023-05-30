import { App } from 'vue';
import { Module } from 'vuex';
import { State } from '../..';
import createActions from './operation.actions';
import { getters } from './operation.getters';
import { mutations } from './operation.mutations';
import { OperationState, state } from './operation.state';

const createModule = (app: App): Module<OperationState, State> => {
  return {
    state,
    mutations,
    getters,
    actions: createActions(app.config.globalProperties.$socket),
    namespaced: true,
  };
};

export type { OperationState } from './operation.state';
export default (app: App) => createModule(app);
