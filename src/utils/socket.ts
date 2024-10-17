import { io } from 'socket.io-client';
import { BASE_URL } from '@/utils/apiClient';

export const socket = io('http://localhost:3000', {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});
