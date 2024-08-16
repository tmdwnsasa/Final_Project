import * as env from '../constants/env.js';
import * as header from '../constants/header.js';

export const config = {
  server: {
    port: env.PORT,
    host: env.HOST,
    frame: 1 / 60,
  },
  client: {
    version: env.CLIENT_VERSION,
  },
  packet: {
    totalLength: header.TOTAL_LENGTH,
    typeLength: header.PACKET_TYPE_LENGTH,
  },
  database: {
    REDIS: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
  },
};
