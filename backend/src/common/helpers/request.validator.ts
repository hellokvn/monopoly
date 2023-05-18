import { Socket } from 'socket.io';

export function getClient<T>(args: T): Socket | undefined {
  let isSearching: boolean = true;
  let index: number = 0;
  let client: Socket | undefined = undefined;

  do {
    client = args[index];
    index = index + 1;

    if (client instanceof Socket) {
      isSearching = false;
    } else {
      client = undefined;
    }
  } while (isSearching && index < 4);

  return client;
}

export function getMessage<T>(args: T): T | undefined {
  let isSearching: boolean = true;
  let index: number = 0;
  let message: T | any | undefined = undefined;

  do {
    message = args[index];
    index = index + 1;

    if (message && message.gameId) {
      isSearching = false;
    } else {
      message = undefined;
    }
  } while (isSearching && index < 4);

  return message;
}
