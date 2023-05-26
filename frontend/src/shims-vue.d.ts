/* eslint-disable */
import type { DefineComponent } from 'vue';
import type { State } from './store';

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue/runtime-core' {
  import type { AxiosInstance } from 'axios';
  import type { Socket } from 'socket.io-client';
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $socket: Socket;
    $store: Store<State>;
    $filters: { currency: (value: number, currency?: string) => string };
  }
}

declare module 'vue' {
  import type { AxiosInstance } from 'axios';
  import type { Socket } from 'socket.io-client';
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $socket: Socket;
    $store: Store<State>;
    $filters: { currency: (value: number, currency?: string) => string };
  }
}
