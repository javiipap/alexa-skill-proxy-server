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
  const { user: user_id, device: device_id } = req.headers;
  if (typeof user_id !== 'string' || typeof device_id !== 'string') {
    return res.status(401).end();
  }

  const { calendarId } = req.query;

  if (typeof calendarId !== 'string') {
    return res.status(400).end();
  }

  if (!checkTypeValidity(req.body, validTypes[req.method!])) {
    return res.status(400).json({ error: 'Request malformed' });
  }

  const db = await connect();
  const device = (await db.collection('devices').findOne({
    uuid: device_id,
    sessions: { uuid: user_id },
  }))! as unknown as Device;
  const user = device.sessions.find((u) => u.uuid === user_id)!;
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
