import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  constructor() {}

  socket = io('http://localhost:5000');
}
