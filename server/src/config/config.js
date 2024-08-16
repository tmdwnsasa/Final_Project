import * as env from '../constants/env.js';
import * as header from '../constants/header.js';

export const config = {
  server: {
    port: env.PORT,
    host: env.HOST,
    frame: 1 / 60,
  },
  dbServer: {
    host: env.DB_HOST,
    port: env.DB_PORT,
  },
  client: {
    version: env.CLIENT_VERSION,
  },
  packet: {
    totalLength: header.TOTAL_LENGTH,
    typeLength: header.PACKET_TYPE_LENGTH,
  },
  webHook: {
    DISCORD: env.DISCORD_WEB_HOOK,
    GITHUB: env.GITHUB_WEB_HOOK,
  },
  database: {
    REDIS: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
  },
};
