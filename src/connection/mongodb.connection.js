import { MongoClient } from 'mongodb';
import { configDotenv } from 'dotenv';

configDotenv();
const { MONGODB_URL } = process.env;
const client = new MongoClient(MONGODB_URL);
const db = client.db('modena_accordo');
(async () => {
    await client.connect().catch(err => {
        console.log('Failed connected to the server')
    })
})();

export { client, db }