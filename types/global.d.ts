import { Credentials } from 'google-auth-library';
import type { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServer } from 'socket.io';

export {};

declare global {
  var pendung: { [key: string]: Mutex };
  interface User {
    mail: string;
    uuid: string;
    credentials: Credentials;
  }

  interface SocketServer extends HTTPServer {
    io?: IOServer | undefined;
  }

  interface SocketWithIO extends NetSocket {
    server: SocketServer;
  }

  export interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
  }

  interface Alexa {
    mail: string | undefined;
    uuid: string | undefined;
  }

  interface typeCheck {
    [key: string]: 'string' | 'number' | 'boolean' | typeCheck;
  }
}
