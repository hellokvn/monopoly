import { OperationType } from '@/common/types';
import { MutationTree } from 'vuex';
import { OperationState, getDefaultState } from './operation.state';

export const mutations: MutationTree<OperationState> = {
  resetState(state: OperationState) {
    Object.assign(state, getDefaultState());
  },
  setActiveOperationType(state: OperationState, activeOperationType: OperationType) {
    state.activeOperationType = activeOperationType;
  },
};
