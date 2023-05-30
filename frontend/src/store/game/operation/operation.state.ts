import { OperationType } from '@/common/types';

export interface OperationState {
  activeOperationType: OperationType | null;
}

export const getDefaultState = (): OperationState => {
  return {
    activeOperationType: null,
  };
};

export const state = (): OperationState => getDefaultState();
