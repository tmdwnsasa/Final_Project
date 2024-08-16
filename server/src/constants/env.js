// 중앙 집중식 관리

import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const CLIENT_VERSION = process.env.CLIENT_VERSION;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;

export const DISCORD_WEB_HOOK = process.env.DISCORD_WEB_HOOK;

export const DB_HOST = process.env.DB_SERVER_HOST;
export const DB_PORT = process.env.DB_SERVER_PORT;
