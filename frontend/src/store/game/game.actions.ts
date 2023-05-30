import { ClientSocketEvents, Game, GameId, ServerSocketEvents, SocketServerData } from '@monopoly/sdk';
import { Socket } from 'socket.io-client';
import { ActionContext, ActionTree } from 'vuex';
import { State } from '..';
import { GameState } from './game.state';

type EmitGameEvent = string | { event: ClientSocketEvents; data: unknown };

const createActions = (socket: Socket): ActionTree<GameState, State> => {
  return {
    async createGame({ commit }: ActionContext<GameState, State>): Promise<GameId | void> {
      console.log('game/action/createGame');
      const res: SocketServerData<GameId> = await socket.emitWithAck(ClientSocketEvents.CreateGame);

      console.log({ res });

      if (res.error) {
        return console.error('ERROR', res);
      }

      commit('resetState');
      commit('setGameId', res.data);

      return res.data;
    },
    async joinGame({ commit }: ActionContext<GameState, State>, gameId: GameId): Promise<Game | void> {
      console.log({ gameId });
      const res: SocketServerData<Game> = await socket.emitWithAck(ClientSocketEvents.JoinGame, { gameId });

      console.log({ res });

      if (res.error) {
        return console.error('ERROR', res);
      }
      // commit('setEventName', res.eventName);
      const playerIndex = res.data.players.findIndex(({ clientId }) => clientId === socket.id);

      commit('setGame', res.data);
      commit('setPlayerIndex', playerIndex);

      socket.on(ServerSocketEvents.GameUpdate, ({ data }: SocketServerData<Game>) => {
        console.log('----- GAME UPDATE -----', data);
        commit('setGame', data);
      });

      return res.data;
    },
    async leaveGame({ commit }: ActionContext<GameState, State>): Promise<void> {
      console.log('leaveGame');
      const res: SocketServerData<Game> = await socket.emitWithAck(ClientSocketEvents.LeaveGame);

      console.log({ res });

      if (res.error) {
        return console.error('ERROR', res);
      }

      commit('resetState');
    },
    async emitGameEvent({ commit }: ActionContext<GameState, State>, payload: EmitGameEvent): Promise<Game | void> {
      let res: SocketServerData<Game>;

      if (typeof payload === 'string') {
        res = await socket.emitWithAck(payload);
        console.log(`emitGameEvent/${payload}`, { res });
      } else {
        res = await socket.emitWithAck(payload.event, payload.data);
        console.log(`emitGameEvent/${payload.event}`, { res });
      }

      if (res.error) {
        return console.error('ERROR', res);
      }

      commit('setGame', res.data);

      return res.data;
    },
  };
};

export default (socket: Socket) => createActions(socket);
