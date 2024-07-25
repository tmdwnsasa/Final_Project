import { config } from '../config/config.js';
import redis from 'redis';

// connect Redis
const redisClient = redis.createClient({
  socket: {
    host: config.database.REDIS.host,
    port: config.database.REDIS.port,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient
  .connect()
  .then(() => {
    console.log('Connected to Redis');
  })
  .catch((err) => {
    console.error('Could not connect to Redis', err);
  });

export default redisClient;
