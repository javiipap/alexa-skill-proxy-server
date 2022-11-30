import cred from 'res/oauth-cred';
import { google } from 'googleapis';

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

const authorize = (user: User) => {
  const oauth2Client = new google.auth.OAuth2(
    cred.web.client_id,
    cred.web.client_secret,
    cred.web.redirect_uris[0]
  );

  oauth2Client.credentials = user.cred;

  google.options({ auth: oauth2Client });

  return google;
};

export const getCalendar = (user: User) => {
  return authorize(user).calendar('v3');
};

export const getYt = (user: User) => {
  return authorize(user).youtube('v3');
};
