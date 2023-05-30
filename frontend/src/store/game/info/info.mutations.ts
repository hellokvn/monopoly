import { OperationType } from '@/common/types';
import { isSet } from '@monopoly/sdk';
import { MutationTree } from 'vuex';
import { InfoState, getDefaultState } from './info.state';

interface MutationPayload {
  position: { x: number; y: number };
  fieldIndex?: number;
  operationType?: OperationType;
}

export const mutations: MutationTree<InfoState> = {
  resetState(state: InfoState) {
    Object.assign(state, getDefaultState());
  },
  setInfo(state: InfoState, payload: MutationPayload) {
    state.operationType = null;
    state.fieldIndex = null;
    state.position = payload.position;

    if (isSet(state.fieldIndex)) {
      state.operationType = null;
      state.fieldIndex = payload.fieldIndex as number;
    } else if (payload.operationType) {
      state.operationType = payload.operationType;
      state.fieldIndex = null;
    }

    state.isActive = true;
  },
  clear(state: InfoState) {
    state.isActive = false;
    state.fieldIndex = null;
    state.operationType = null;
  },
};
