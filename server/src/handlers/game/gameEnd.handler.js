import {
  createMatchHistory,
  createMatchLog,
  createUserRating,
  createUserScore,
  findUserRatingTable,
  findUserScoreTable,
  getUserRating,
  getUserScore,
  updateUserRating,
  updateUserScore,
} from '../../db/game/game.db.js';
import { getGameSession } from '../../sessions/game.session.js';
import { matchQueueSession } from '../../sessions/session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { createGameEndPacket } from '../../utils/notification/game.notification.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';

export const GameEndHandler = async ({ socket, userId, data }) => {
  try {
    const { sessionId } = data;
    const gameSession = getGameSession(sessionId);
    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다');
    }

    const user = gameSession.getUser(userId);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, `${gameSession}게임에 ${userId}님을 찾을 수 없습니다`);
    }

    const findUser = await getUserBySocket(socket); //유저세션에서 해당 유저 찾기
    if (!findUser) {
      console.log(`유저세션에 유저가 존재하지 않습니다`);
      return;
    }

    // const gameSession = {
    //   sessionId: 'abcdef',
    //   users: [
    //     { playerId: 'aaa', characterId: 1, socket: 'a' },
    //     { playerId: 'mmm', characterId: 2, socket: 'b' },
    //     { playerId: 'qqq', characterId: 3, socket: 'c' },
    //     { playerId: 'xxx', characterId: 4, socket: 'd' },
    //   ],
    // };

    //현재 서버에서 관리하는 게임세션에는 redTeam blueTeam이 구분이 안되어있어서 매치큐에서 편성하는 코드 긁어옴
    const players = gameSession.users.splice(0, 4);
    const redTeam = players.slice(0, 2);
    const blueTeam = players.slice(2, 4);
    const myTeam = redTeam.some((user) => user.socket === 'b');
    const winnerTeam = myTeam ? 'RedTeam' : 'BlueTeam';
    const winTeam = myTeam ? redTeam : blueTeam;
    const loseTeam = !myTeam ? redTeam : blueTeam;

    console.log('111', winnerTeam);
    console.log('222', redTeam);
    console.log('333', blueTeam);

    await asyncSaveScoreRating(winTeam, loseTeam);
    // let kill = 2;
    // let death = 0;
    // let damage = 200;
    // let startTime = Date.now();
    // let playerId = 'a';

    const users = redTeam.concat(blueTeam);
    await saveMatchHistory(users,gameSession.sessionId);
    
    await createMatchLog(
      gameSession.sessionId,
      redTeam[0].playerId,
      redTeam[1].playerId,
      blueTeam[0].playerId,
      blueTeam[1].playerId,
      winnerTeam,
      startTime,
    );
    console.log('매치로그가 DB에 저장되었습니다');

    //   대전 결과 패킷 - 통지
    // string winnerTeam = 1
    // repeated UserHistory users = 2

    // message UserState {
    //     string playerId = 1
    //     uint32 kill = 2
    //     uint32 death = 3
    // }

    // const data = {
    // winnerTeam,
    // users, }
    // const packet = createGameEndPacket(data);

    // //패킷 통지
    // socket.write(packet);
  } catch (err) {
    console.log('gameEndHandler에서 발생한 오류:', err);
  }
};

//유저 DB에 저장된 score찾기
async function winSaveScore(winTeam) {
  for (const user of winTeam) {
    try {
      const findUserScore = await findUserScoreTable(user.playerId);
      if (!findUserScore) {
        await createUserScore(user.playerId, 50);
        console.log(`${user.playerId}님의 Score가 생성`);
      } else {
        const score = await getUserScore(user.playerId);
        await updateUserScore(user.playerId, score + 50);
        console.log(`${user.playerId}님의 Score가 갱신`);
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Score저장 중 에러 발생:`, err);
    }
  }
}

async function loseSaveScore(loseTeam) {
  for (const user of loseTeam) {
    try {
      const findUserScore = await findUserScoreTable(user.playerId);
      if (!findUserScore) {
        await createUserScore(user.playerId, 0);
        console.log(`${user.playerId}님의 Score가 생성`);
      } else {
        let score = await getUserScore(user.playerId);
        if (score - 25 <= 0) {
          score = 0;
          await updateUserScore(user.playerId, score);
        } else {
          await updateUserScore(user.playerId, score - 25);

          console.log(`${user.playerId}님의 Score가 갱신`);
        }
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Score저장 중 에러 발생:`, err);
    }
  }
}

//유저DB에 rating 찾기
async function winSaveRating(winTeam) {
  for (const user of winTeam) {
    try {
      const findUserRating = await findUserRatingTable(user.playerId);
      if (!findUserRating) {
        await createUserRating(user.playerId, user.characterId, 1, 0);
        console.log(`${user.playerId}님의 Rating이 생성`);
      } else {
        const ratingTable = await getUserRating(user.playerId);
        await updateUserRating(user.playerId, user.characterId, ++ratingTable.win, ratingTable.lose);
        console.log(`${user.playerId}님의 Rating이 갱신`);
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Rating저장 중 에러 발생:`, err);
    }
  }
}

async function loseSaveRating(loseTeam) {
  for (const user of loseTeam) {
    try {
      const findUserRating = await findUserRatingTable(user.playerId);
      if (!findUserRating) {
        await createUserRating(user.playerId, user.characterId, 0, 1);
        console.log(`${user.playerId}님의 Rating이 생성`);
      } else {
        const ratingTable = await getUserRating(user.playerId);
        await updateUserRating(user.playerId, user.characterId, ratingTable.win, ++ratingTable.lose);
        console.log(`${user.playerId}님의 Rating이 갱신`);
      }
    } catch (err) {
      console.error(`${user.playerId}님의 Rating저장 중 에러 발생:`, err);
    }
  }
}

//순차적으로 저장
const asyncSaveScoreRating = async (winTeam, loseTeam) => {
  await winSaveScore(winTeam);
  await loseSaveScore(loseTeam);
  await winSaveRating(winTeam);
  await loseSaveRating(loseTeam);
  console.log('score, rating DB저장 완료');
};

async function saveMatchHistory(users, sessionId) {
  for (const user of users) {
    try {
      await createMatchHistory(sessionId, user.playerId, user.kill, user.death, user.damage);
      console.log(`${user.playerId}님의 전적 저장완료`);
    } catch (err) {
      console.error(`매치전적 저장 중 에러 발생:`, err);
    }
  }
}