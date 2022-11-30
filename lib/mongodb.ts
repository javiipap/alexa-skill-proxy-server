import { Db, MongoClient } from 'mongodb';

const connect = async (): Promise<Db> => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;
  const options = {};

  const client = new MongoClient(uri, options);

  return client.db('alexa-skill');
};

export default connect;
