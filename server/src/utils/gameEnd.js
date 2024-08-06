import {
  createMatchHistory,
  createUserRating,
  createUserScore,
  dbSaveTransaction,
  findUserScoreTable,
  getUserRating,
  getUserScore,
  updateUserRating,
  updateUserScore,
} from '../db/game/game.db.js';
import { createGameEndPacket } from './notification/game.notification.js';

export const gameEnd = async (gameSessionId, winnerTeam, loserTeam, winTeamColor, startTime) => {
  try {
    const users = winnerTeam.concat(loserTeam).map((user) => {
      return { playerId: user.playerId, kill: user.kill, death: user.death };
    });

    console.log(users);

    // for (let i = 1; i < 4; i++) {
    //   try {
    //     await dbSaveTransaction(winnerTeam, loserTeam, users, gameSessionId, winTeamColor, startTime);
    //     break;
    //   } catch (err) {
    //     console.error(`db저장 실패 ${i}번째 시도 중..,${err.message}`);
    //     if (i === 3) {
    //       console.log('3번 모두 저장 실패!');
    //       //db저장 수작업해야하니 추후에 추가
    //     }
    //   }
    // }

    const winPayload = {
      result: 'Win',
      users: users,
    };
    const losePayload = {
      result: 'Lose',
      users: users,
    };

    const winPacket = createGameEndPacket(winPayload);
    const losePacket = createGameEndPacket(losePayload);

    //패킷 통지
    winnerTeam.forEach((user) => user.socket.write(winPacket));
    loserTeam.forEach((user) => user.socket.write(losePacket));
  } catch (err) {
    console.log('gameEndHandler에서 발생한 오류:', err);
  }
};

//유저 DB에 저장된 score찾기
async function winSaveScore(connection, winTeam) {
  for (const user of winTeam) {
    try {
      const findUserScore = await findUserScoreTable(connection, user.playerId);
      if (!findUserScore) {
        await createUserScore(connection, user.playerId, 50);
        console.log(`${user.playerId}님의 Score가 생성`);
      } else {
        const score = await getUserScore(connection, user.playerId);
        await updateUserScore(connection, user.playerId, score + 50);
        console.log(`${user.playerId}님의 Score가 갱신`);
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Score저장 중 에러 발생:`, err);
    }
  }
}

async function loseSaveScore(connection, loseTeam) {
  for (const user of loseTeam) {
    try {
      const findUserScore = await findUserScoreTable(connection, user.playerId);
      if (!findUserScore) {
        await createUserScore(connection, user.playerId, 0);
        console.log(`${user.playerId}님의 Score가 생성`);
      } else {
        let score = await getUserScore(connection, user.playerId);
        if (score - 25 <= 0) {
          score = 0;
          await updateUserScore(connection, user.playerId, score);
          console.log(`${user.playerId}님의 Score가 갱신`);
        } else {
          await updateUserScore(connection, user.playerId, score - 25);

          console.log(`${user.playerId}님의 Score가 갱신`);
        }
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Score저장 중 에러 발생:`, err);
    }
  }
}

//유저DB에 rating 찾기
async function winSaveRating(connection, winTeam) {
  for (const user of winTeam) {
    try {
      const findUserRating = await getUserRating(connection, user.playerId);
      if (!findUserRating) {
        await createUserRating(connection, user.playerId, user.character.characterId - 1, 1, 0);
        console.log(`${user.playerId}님의 Rating이 생성`);
      } else {
        const ratingTable = await getUserRating(connection, user.playerId);
        await updateUserRating(connection, user.playerId, user.characterId, ++ratingTable.win, ratingTable.lose);
        console.log(`${user.playerId}님의 Rating이 갱신`);
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Rating저장 중 에러 발생:`, err);
    }
  }
}

async function loseSaveRating(connection, loseTeam) {
  for (const user of loseTeam) {
    try {
      const findUserRating = await getUserRating(connection, user.playerId);
      if (!findUserRating) {
        await createUserRating(connection, user.playerId, user.character.characterId - 1, 0, 1);
        console.log(`${user.playerId}님의 Rating이 생성`);
      } else {
        const ratingTable = await getUserRating(connection, user.playerId);
        await updateUserRating(connection, user.playerId, user.characterId, ratingTable.win, ++ratingTable.lose);
        console.log(`${user.playerId}님의 Rating이 갱신`);
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Rating저장 중 에러 발생:`, err);
    }
  }
}

//순차적으로 저장
export const asyncSaveScoreRating = async (connection, winTeam, loseTeam) => {
  await winSaveScore(connection, winTeam);
  await loseSaveScore(connection, loseTeam);
  await winSaveRating(connection, winTeam);
  await loseSaveRating(connection, loseTeam);
  console.log('score, rating DB저장 완료');
};

export async function saveMatchHistory(connection, users, sessionId) {
  for (const user of users) {
    try {
      await createMatchHistory(connection, sessionId, user.playerId, user.kill, user.death, user.damage);
      console.log(`${user.playerId}님의 전적 저장완료`);
    } catch (err) {
      console.error(`매치전적 저장 중 에러 발생:`, err);
    }
  }
}
