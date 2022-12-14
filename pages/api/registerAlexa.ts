import { NextApiHandler } from 'next';
import connect from 'lib/mongodb';

const registerAlexa: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const data: Alexa = req.body;
  if (!(data.device && data.user && Object.keys(data).length == 2)) {
    return res.status(400).end();
  }

  try {
    const db = await connect();

    const device = await db.collection('devices').findOne({
      uuid: data.device,
    });

    if (device !== null) {
      const user = device.sessions.find((el: User) => el.uuid === data.user);

      if (user !== null)
        return res
          .status(201)
          .json({ error: 'La cuenta ya existe en el servidor' });
    }

    if (!device) {
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
};

export default registerAlexa;
