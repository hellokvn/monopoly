import '@/assets/scss/main.scss';
import axios from 'axios';
import { io } from 'socket.io-client';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);
const headers: Record<string, string> = { 'Content-Type': 'application/json' };
const baseURL: string = process.env.API_URL as string;

function bootstrap(): void {
  app.config.globalProperties.$axios = axios.create({ baseURL, headers });
  app.config.globalProperties.$socket = io('ws://127.0.0.1:3000/game');
  app.config.globalProperties.$filters = {
    currency(value: number, currency = 'Gold'): string {
      return `${value} ${currency}`;
    },
  };

  app.use(store(app));
  app.use(router);

  app.directive('scroll', {
    updated<T extends HTMLElement>(element: T) {
      element.scrollTop = element.scrollHeight;
    },
  });

  app.mount('#app');
}

bootstrap();
