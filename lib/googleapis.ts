import cred from 'res/oauth-cred';
import { google } from 'googleapis';
import { GaxiosPromise } from 'googleapis/build/src/apis/abusiveexperiencereport';

export const generateAuthUrl = () => {
  const oauth2Client = new google.auth.OAuth2(
    cred.web.client_id,
    cred.web.client_secret,
    cred.web.redirect_uris[0]
  );

  const scopes = process.env.GOOGLE_CALENDAR_SCOPES!.split(',');

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes.join(' '),
  });
};

export const authorize = (user: User) => {
  const oauth2Client = new google.auth.OAuth2(
    cred.web.client_id,
    cred.web.client_secret,
    cred.web.redirect_uris[0]
  );

  oauth2Client.setCredentials(user.credentials);

  google.options({ auth: oauth2Client });

  return google;
};

export const runSecure = async <T>(prom: GaxiosPromise<T>) => {
  let data = undefined;
  let status = 200;

  try {
    const res = await prom;
    data = res.data;
  } catch (e) {
    const err = e as any;

    if ('response' in err) {
      status = err.response.code;
      data = err.response.errors;
    } else {
      data = err;
      status = 500;
    }
  }

  return { status, data };
};

const _runSecure = async (query: () => Promise<any>) => {
  let data = undefined;
  let status = 200;

  try {
    const res = await query();
    data = res.data;
  } catch (e) {
    const err = e as any;

    if ('response' in err) {
      status = err.response.code;
      data = err.response.errors;
    } else {
      data = err;
      status = 500;
    }
  }

  return { status, data };
};

export const getCalendar = (user: User) => {
  return authorize(user).calendar('v3');
};

export const getYt = (user: User) => {
  return authorize(user).youtube('v3');
};
