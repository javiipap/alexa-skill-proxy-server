import { authorize, runSecure } from 'lib/googleapis';
import connect from 'lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextApiHandler } from 'next';

const Channels: NextApiHandler = async (req, res) => {
  const { bearer } = req.headers;
  if (typeof bearer !== 'string') {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const db = await connect();
    const user = (await db
      .collection('devices')
      .findOne({ _id: new ObjectId(bearer) })) as unknown as User;
    const youtube = authorize(user).youtube('v3');

    const { status, data } = await runSecure(
      youtube.subscriptions.list({
        part: ['id', 'snippet'],
        mine: true,
      })
    );

    return res.status(status).json(data);
  }
};

export default Channels;
