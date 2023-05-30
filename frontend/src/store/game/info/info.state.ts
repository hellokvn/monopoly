import { OperationType } from '@/common/types';

export interface InfoState {
  position: { x: number; y: number };
  isActive: boolean;
  fieldIndex: number | null;
  operationType: OperationType | null;
}

export const getDefaultState = (): InfoState => {
  return {
    position: { x: 0, y: 0 },
    isActive: false,
    fieldIndex: null,
    operationType: null,
  };
};

export const state = (): InfoState => getDefaultState();
