import { authorize } from 'lib/googleapis';
import { NextApiHandler } from 'next';
import connect from 'lib/mongodb';
import { ObjectId } from 'mongodb';

const CalendarHandler: NextApiHandler = async (req, res) => {
  const { bearer } = req.headers;
  if (typeof bearer !== 'string') {
    return res.status(401).end();
  }

  if (req.method === 'GET') {
    const db = await connect();
    const user = (await db
      .collection('users')
      .findOne({ _id: new ObjectId(bearer) })) as unknown as User;
    const calendar = authorize(user).calendar('v3');

    const { data } = await calendar.calendarList.list();

    return res.status(200).json({ calendars: data.items });
  }
};

export default CalendarHandler;
