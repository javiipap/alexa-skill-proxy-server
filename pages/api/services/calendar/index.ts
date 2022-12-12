import { authorize, runSecure } from 'lib/googleapis';
import { NextApiHandler } from 'next';
import connect from 'lib/mongodb';
import { ObjectId } from 'mongodb';

const CalendarHandler: NextApiHandler = async (req, res) => {
  const { user_id, device } = req.headers;
  if (typeof user_id !== 'string' || typeof device !== 'string') {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const db = await connect();
    const device = (await db.collection('devices').findOne({
      uuid: user_id,
      sessions: { uuid: user_id },
    })) as unknown as Device;

    const user = device.sessions.find((u) => u.uuid === user_id);

    if (!user) {
      return res.status(401).send('No se encontró el usuario.');
    }

    const calendar = authorize(user).calendar('v3');

    const { status, data } = await runSecure(calendar.calendarList.list());

    return res.status(status).json(data);
  }
};

export default CalendarHandler;
