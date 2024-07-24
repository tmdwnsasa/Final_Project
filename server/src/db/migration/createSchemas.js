import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pools from '../database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  const queries = sql
    .split(';')
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (const query of queries) {
    await pool.query(query);
  }
};

const createSchema = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql'));
    await executeSqlFile(pools.GAME_DB, path.join(sqlDir, 'game_db.sql'));
  } catch (err) {
    console.error(`데이터베이스 테이블 생성 중 오류가 발생했습니다: ${err}`);
  }
};

createSchema()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
