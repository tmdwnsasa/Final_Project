import { createCharacter, createCharacterSkill } from './game.db.js';

const createCharacters = async () => {
  await createCharacter('근씨 아저씨', 150, 5, 10, 0.1, 0.05, 5000);
  await createCharacter('원씨 아줌마', 100, 4, 12, 0.08, 0.1, 5000);
  await createCharacter('힐씨 아줌마', 80, 5, 7, 0.09, 0, 5000);
  await createCharacter('탱씨 아저씨', 200, 4, 8, 0.15, 0.05, 5000);
};

const createCharacterSkills = async () => {
  // 근씨 아저씨 스킬들
  await createCharacterSkill('괭이질', 1, 1, 1, 1, null, null);
  await createCharacterSkill('대쉬', 3, 1, null, 10, 4, null);
  await createCharacterSkill('광폭화', 4, 1, null, 30, null, null);

  // 원씨 아줌마 스킬들
  await createCharacterSkill('씨 뿌리기', 2, 2, 1, 1, null, null);
  await createCharacterSkill('불장판', 5, 2, 2, 15, 15, 10);
  await createCharacterSkill('궁극기', 6, 2, 0.2, 30, 20, null);

  // 힐씨 아줌마 스킬들
  await createCharacterSkill('물 뿌리기', 2, 3, 1, 1, null, null);
  await createCharacterSkill('새참', 5, 3, 1, 5, 10, null);
  await createCharacterSkill('부활', 6, 3, null, 50, 1, null);

  // 탱씨 아저씨 스킬들
  await createCharacterSkill('삽질', 1, 4, 1, 1, 1, null);
  await createCharacterSkill('방패막기', 7, 4, null, 5, null, null);
  await createCharacterSkill('궁극기', 5, 4, 0.2, 30, 1, 30);
};

const createGameContents = async () => {
  await createCharacters();
  await createCharacterSkills();
};

createGameContents()
  .then(() => {
    console.log('GAME_DB에 내용들이 들어갔습니다');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
