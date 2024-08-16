// 중앙 집중식 관리

import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const CLIENT_VERSION = process.env.CLIENT_VERSION;

export const DISCORD_WEB_HOOK = process.env.DISCORD_WEB_HOOK;
export const GITHUB_WEB_HOOK = process.env.GITHUB_WEB_HOOK;

export const USER_DB_NAME = process.env.USER_DB_NAME;
export const USER_DB_USER = process.env.USER_DB_USER;
export const USER_DB_PASSWORD = process.env.USER_DB_PASSWORD;
export const USER_DB_HOST = process.env.USER_DB_HOST;
export const USER_DB_PORT = process.env.USER_DB_PORT;

export const GAME_DB_NAME = process.env.GAME_DB_NAME;
export const GAME_DB_USER = process.env.GAME_DB_USER;
export const GAME_DB_PASSWORD = process.env.GAME_DB_PASSWORD;
export const GAME_DB_HOST = process.env.GAME_DB_HOST;
export const GAME_DB_PORT = process.env.GAME_DB_PORT;

export const ERROR_DB_NAME = process.env.ERROR_DB_NAME;
export const ERROR_DB_USER = process.env.ERROR_DB_USER;
export const ERROR_DB_PASSWORD = process.env.ERROR_DB_PASSWORD;
export const ERROR_DB_HOST = process.env.ERROR_DB_HOST;
export const ERROR_DB_PORT = process.env.ERROR_DB_PORT;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;

export const SHARD_1_NAME = process.env.AWS_SHARD_1_NAME;
export const SHARD_1_USER = process.env.AWS_SHARD_1_USER;
export const SHARD_1_PASSWORD = process.env.AWS_SHARD_1_PASSWORD;
export const SHARD_1_HOST = process.env.AWS_SHARD_1_HOST;
export const SHARD_1_PORT = process.env.AWS_SHARD_1_PORT;

export const SHARD_2_NAME = process.env.AWS_SHARD_2_NAME;
export const SHARD_2_USER = process.env.AWS_SHARD_2_USER;
export const SHARD_2_PASSWORD = process.env.AWS_SHARD_2_PASSWORD;
export const SHARD_2_HOST = process.env.AWS_SHARD_2_HOST;
export const SHARD_2_PORT = process.env.AWS_SHARD_2_PORT;

export const SHARD_3_NAME = process.env.AWS_SHARD_3_NAME;
export const SHARD_3_USER = process.env.AWS_SHARD_3_USER;
export const SHARD_3_PASSWORD = process.env.AWS_SHARD_3_PASSWORD;
export const SHARD_3_HOST = process.env.AWS_SHARD_3_HOST;
export const SHARD_3_PORT = process.env.AWS_SHARD_3_PORT;
