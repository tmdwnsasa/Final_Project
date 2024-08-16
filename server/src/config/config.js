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
  webHook: {
    DISCORD: env.DISCORD_WEB_HOOK,
    GITHUB: env.GITHUB_WEB_HOOK,
  },
  database: {
    GAME_DB: {
      name: env.GAME_DB_NAME,
      user: env.GAME_DB_USER,
      password: env.GAME_DB_PASSWORD,
      host: env.GAME_DB_HOST,
      port: env.GAME_DB_PORT,
    },
    USER_DB: {
      name: env.USER_DB_NAME,
      user: env.USER_DB_USER,
      password: env.USER_DB_PASSWORD,
      host: env.USER_DB_HOST,
      port: env.USER_DB_PORT,
    },
    ERROR_DB: {
      name: env.ERROR_DB_NAME,
      user: env.ERROR_DB_USER,
      password: env.ERROR_DB_PASSWORD,
      host: env.ERROR_DB_HOST,
      port: env.ERROR_DB_PORT,
    },
    MAP_DB: {
      name: env.MAP_DB_NAME,
      user: env.MAP_DB_USER,
      password: env.MAP_DB_PASSWORD,
      host: env.MAP_DB_HOST,
      port: env.MAP_DB_PORT,
    },
    REDIS: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
    SHARDS: {
      1: {
        name: env.SHARD_1_NAME,
        user: env.SHARD_1_USER,
        password: env.SHARD_1_PASSWORD,
        host: env.SHARD_1_HOST,
        port: env.SHARD_1_PORT,
      },
      2: {
        name: env.SHARD_2_NAME,
        user: env.SHARD_2_USER,
        password: env.SHARD_2_PASSWORD,
        host: env.SHARD_2_HOST,
        port: env.SHARD_2_PORT,
      },
      3: {
        name: env.SHARD_3_NAME,
        user: env.SHARD_3_USER,
        password: env.SHARD_3_PASSWORD,
        host: env.SHARD_3_HOST,
        port: env.SHARD_3_PORT,
      },
    },
  },
};
