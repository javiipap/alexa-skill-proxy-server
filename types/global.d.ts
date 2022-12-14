import { Credentials } from 'google-auth-library';
import type { Server as HTTPServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServer } from 'socket.io';

export {};

declare global {
  export interface User {
    mail: string;
    uuid: string;
    credentials: Credentials;
  }

  export interface Device {
    uuid: string;
    sessions: User[];
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
    device: string | undefined;
    user: string | undefined;
  }

  interface typeCheck {
    [key: string]: 'string' | 'number' | 'boolean' | typeCheck;
  }
}
