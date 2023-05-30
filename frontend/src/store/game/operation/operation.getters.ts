import { GetterTree } from 'vuex';
import { State } from '../..';
import { OperationState } from './operation.state';

export const getters: GetterTree<OperationState, State> = {
  getActiveOperationType: ({ activeOperationType }: OperationState) => activeOperationType,
};
