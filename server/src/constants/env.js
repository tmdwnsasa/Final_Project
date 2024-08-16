// 중앙 집중식 관리

import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST;
export const CLIENT_VERSION = process.env.CLIENT_VERSION;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;

export const DISCORD_WEB_HOOK = process.dnv.DISCORD_WEB_HOOK;
