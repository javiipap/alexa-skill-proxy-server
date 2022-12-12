import connect from 'lib/mongodb';
import { authorize, runSecure } from 'lib/googleapis';
import { ObjectId } from 'mongodb';
import { NextApiHandler, NextApiRequest } from 'next';
import checkTypeValidity from 'utils/checkTypeValidity';

const validTypes: { [key: string]: typeCheck } = {
  POST: {
    'colorId?': 'string',
    start: {
      'date?': 'string',
      'dateTime?': 'string',
      'timeZone?': 'string',
    },
    end: {
      'date?': 'string',
      'dateTime?': 'string',
      'timeZone?': 'string',
    },
    'description?': 'string',
    'reminders?': {
      useDefault: 'boolean',
    },
    'summary?': 'string',
  },
  PUT: { text: 'string' },
};

const CalendarIdHandler: NextApiHandler = async (req, res) => {
  const { bearer } = req.headers;
  const { calendarId } = req.query;

  if (typeof bearer !== 'string') {
    return res.status(401).end();
  }

  if (typeof calendarId !== 'string') {
    return res.status(400).end();
  }

  if (!checkTypeValidity(req.body, validTypes[req.method!])) {
    return res.status(400).json({ error: 'Request malformed' });
  }

  const db = await connect();
  const user = (await db
    .collection('devices')
    .findOne({ _id: new ObjectId(bearer) })) as unknown as User;
  const calendar = authorize(user).calendar('v3');

  if (req.method === 'GET') {
    const tonight = new Date();
    tonight.setHours(24, 0, 0, 0);
    const dateBounds = {
      timeMin: new Date().toISOString(),
      timeMax: tonight.toISOString(),
    };

    const { status, data } = await runSecure(
      calendar.events.list({
        calendarId,
        ...dateBounds,
      })
    );

    return res.status(status).json(data);
  } else if (req.method === 'POST') {
    const { status, data } = await runSecure(
      calendar.events.insert({
        calendarId,
        requestBody: req.body,
      })
    );
    return res.status(status).json(data);
  } else if (req.method === 'PUT') {
    const { status, data } = await runSecure(
      calendar.events.quickAdd({
        calendarId,
        ...req.body,
      })
    );
    return res.status(status).json(data);
  }
};

export default CalendarIdHandler;
