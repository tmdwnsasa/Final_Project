import mysql from 'mysql2/promise';
import { config } from '../config/config.js';
import { formatDate } from '../utils/dateFormatter.js';

const { database } = config;

const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
    waitForConnections: true,
    connectionLimit: 10, // 커넥션 풀에서 최대 연결 수
    queueLimit: 0, // 0일 경우 무제한 대기열
  });

  const originQuery = pool.query;

  pool.query = (sql, params) => {
    const date = new Date();

    console.log(
      `[${formatDate(date)}] Execution query: ${sql} ${params ? `${JSON.stringify(params)}` : ``}`,
    );
    return originQuery.call(pool, sql, params);
  };
  return pool;
};

const pools = {
  GAME_DB: createPool(database.GAME_DB),
  USER_DB: createPool(database.USER_DB),
  MAP_DB: createPool(database.MAP_DB),
};

export default pools;
