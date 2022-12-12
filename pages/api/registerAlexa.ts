import { NextApiHandler } from 'next';
import connect from 'lib/mongodb';

const registerAlexa: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const data: Alexa = req.body;
  if (data.device && data.user && Object.keys(data).length == 2) {
    try {
      const db = await connect();

      if (
        db.collection('devices').findOne({
          uuid: data.device,
          session: { uuid: data.user },
        }) === null
      ) {
        return res
          .status(201)
          .json({ error: 'La cuenta ya existe en el servidor' });
      }

      const uuid = await db
        .collection('devices')
        .findOne({ uuid: data.device });

      if (!uuid) {
        await db
          .collection('devices')
          .insertOne({ uuid: data.device, sessions: [] });
      }

      await db.collection('devices').updateOne(
        {
          uuid: data.device,
        },
        {
          $push: {
            sessions: {
              uuid: data.user,
            },
          },
        }
      );
      console.log(`Registered user with uuid ${data.user}`);

      return res.status(200).json({ uuid: data.user });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  return res.status(400).end();
};

export default registerAlexa;
