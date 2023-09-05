import { createClient } from 'redis';
import { configDotenv } from 'dotenv';

configDotenv();
const { REDIS_URL } = process.env;
const client = createClient({ url: REDIS_URL });

(async () => {
    if (!client.isOpen) {
        console.log('redis client connect invoked')
        await client.connect();
    } else {
        console.log('redis client is still connected');
    }
})()

export default client;