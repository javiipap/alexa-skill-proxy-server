import type { NextApiRequest } from 'next';
import { Server } from 'socket.io';
import connect from 'lib/mongodb';
import { sleep } from 'utils/sleep';
import { ObjectId } from 'mongodb';

const socketEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  // Esperar peticiones de alexas
  if (res.socket?.server?.io) {
    console.log('Socket is already running');
  } else {
    console.log('Creating socket');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (sock) => {
      console.log(`Connection`);
      sock.on('msg', async (uuid) => {
        console.log(`Recieved hello from sock: ${uuid}`);
        const db = await connect();
        const user = await db
          .collection('users')
          .findOne({ _id: new ObjectId(uuid) });

        // Comprobar que el cliente esté registrada
        if (user != null) {
          console.log(`Sending back to: ${uuid}`);

          // Espera activa.
          while (true) {
            await sleep(5000);
            const u = await db
              .collection('users')
              .findOne({ _id: new ObjectId(uuid) });
            if (u!.credentials) break;
          }

          console.log(`Sent to ${uuid}`);
          sock.emit('granted');
        }
      });
    });
  }

  // Guardar cadena de conexión
  return res.end();
};

export default socketEndpoint;
