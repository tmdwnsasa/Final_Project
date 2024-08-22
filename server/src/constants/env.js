// 중앙 집중식 관리

import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const CLIENT_VERSION = '1.0.0';

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;

export const DISCORD_WEB_HOOK = process.env.DISCORD_WEB_HOOK;

export const DB_HOST = process.env.DB_SERVER_HOST;
export const DB_PORT = process.env.DB_SERVER_PORT;

export const MAP_DB_NAME = process.env.MAP_DB_NAME;
export const MAP_DB_USER = process.env.MAP_DB_USER;
export const MAP_DB_PASSWORD = process.env.MAP_DB_PASSWORD;
export const MAP_DB_HOST = process.env.MAP_DB_HOST;
export const MAP_DB_PORT = process.env.MAP_DB_PORT;

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
