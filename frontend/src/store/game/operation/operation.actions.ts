import { Socket } from 'socket.io-client';
import { ActionTree } from 'vuex';
import { State } from '../..';
import { OperationState } from './operation.state';

const createActions = (socket: Socket): ActionTree<OperationState, State> => {
  return {};
};

export default (socket: Socket) => createActions(socket);
