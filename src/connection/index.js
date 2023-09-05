import mongodb, { client, db } from './mongodb.connection';
import redis from './redis.connection';

export {
    redis,
    db as mongodb,
    client as mongoCLient
}