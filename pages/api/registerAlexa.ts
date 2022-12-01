import { NextApiHandler } from 'next';
import connect from 'lib/mongodb';

const registerAlexa: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const data: Alexa = req.body;
  if (data.mail && Object.keys(data).length == 1) {
    try {
      const db = await connect();

      // if (db.collection('users').findOne({ mail: data.mail }) === null) {
      //   return res.status(400).json({error: 'La cuenta ya existe en el servidor'});
      // }

      const uuid = (await db.collection('users').insertOne(data)).insertedId;

      console.log(`Registered user with uuid ${uuid.toString()}`);

      return res.status(200).json({ uuid });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  return res.status(400).end();
};

export default registerAlexa;
