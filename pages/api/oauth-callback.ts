import { google } from 'googleapis';
import connect from 'lib/mongodb';
import { NextApiHandler } from 'next';
import keys from 'res/oauth-cred';

const GoogleCallback: NextApiHandler = async (req, res) => {
  // Recibir token
  const oauth2Client = new google.auth.OAuth2(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );

  google.options({ auth: oauth2Client });

  const { tokens } = await oauth2Client.getToken(req.query.code as string);
  oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates

  const oauth = google.oauth2({ auth: oauth2Client, version: 'v2' });
  const { data } = await oauth.userinfo.get();

  // Guardar token
  const db = await connect();
  await db.collection('users').updateOne(
    { mail: data.email },
    {
      $set: {
        credentials: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        },
      },
    }
  );

  // Confirmar a la alexa que está autorizada a través del socket.
  return res.status(200).end();
};

export default GoogleCallback;
