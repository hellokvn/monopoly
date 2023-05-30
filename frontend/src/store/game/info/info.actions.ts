import { ClientSocketEvents } from '@monopoly/sdk';
import { Socket } from 'socket.io-client';
import { ActionTree } from 'vuex';
import { State } from '../..';
import { InfoState } from './info.state';

type EmitGameEvent = string | { event: ClientSocketEvents; data: unknown };

const createActions = (socket: Socket): ActionTree<InfoState, State> => {
  return {};
};

export default (socket: Socket) => createActions(socket);
