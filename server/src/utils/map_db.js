import { insertMap } from '../db/map/map.db.js';

const insertMaps = async () => {
  // 호남 북부 1~15
  for (let i = 1; i <= 15; i++) {
    await insertMap(`호남 북부 ${i}`, false, 'red');
  }

  // 호남 중부 1~15
  for (let i = 1; i <= 5; i++) {
    await insertMap(`호남 중부 ${i}`, false, 'red');
  }
  for (let i = 6; i <= 10; i++) {
    await insertMap(`호남 중부 ${i}`, true, null);
  }
  for (let i = 11; i <= 15; i++) {
    await insertMap(`호남 중부 ${i}`, false, 'blue');
  }

  // 호남 남부 1~15
  for (let i = 1; i <= 15; i++) {
    await insertMap(`호남 남부 ${i}`, false, 'blue');
  }
};

insertMaps()
  .then(() => {
    console.log('맵 정보가 DB에 전부 들어갔습니다');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
