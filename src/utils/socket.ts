import { io } from 'socket.io-client';
import { BASE_URL } from '@/utils/apiClient';
// const prod = 'http://172.18.2.18:3000';
// const local = 'http://localhost:3000';

export const socket = io(BASE_URL, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
