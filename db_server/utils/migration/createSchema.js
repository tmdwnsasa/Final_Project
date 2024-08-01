import readline from 'readline';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import { shards } from '../shardUtils.js';

const migrationConfirm = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

migrationConfirm.question(
  '해당 작업은 DB의 정보를 모두 제거하고 새로운 스키마로 재설정 합니다. 진행하시겠습니까? (Y/N):',
  async (answer) => {
    if (answer.trim().toUpperCase() === 'Y') {
      for (const shard of Object.values(shards)) {
        console.log(shard);
        await resetAllData(shard);
      }
    } else {
      console.log('진행 취소됨');
    }
    migrationConfirm.close();
  },
);

const readSQLFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`마이그레이션 오류:파일 읽기 실패 ${filePath}`, err);
    throw err;
  }
};

const resetAllData = async (shard) => {
  const connection = await mysql.createConnection(shard);

  const dropDatabaseSQL = `
  DROP DATABASE IF EXISTS USER_DB;
  DROP DATABASE IF EXISTS GAME_DB;
  DROP DATABASE IF EXISTS ERROR_DB;
  `;
  try {
    await connection.query(dropDatabaseSQL);

    const createUserDatabaseSQL = await readSQLFile('./sql/createUserDatabase.sql');
    const createGameDatabaseSQL = await readSQLFile('./sql/createGameDatabase.sql');
    const createErrorDatabaseSQL = await readSQLFile('./sql/createErrorDatabase.sql');

    await connection.query(createUserDatabaseSQL);
    await connection.query(createGameDatabaseSQL);
    await connection.query(createErrorDatabaseSQL);

    console.log(`데이터 마이그레이션 성공 샤드:${shard}번`);
  } catch (error) {
    console.error(`마이그레이션 중 에러 발생 샤드:${shard}번`);
  } finally {
    await connection.end();
  }
};

