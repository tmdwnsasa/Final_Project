import {
  createMatchHistory,
  createUserRating,
  createUserScore,
  dbSaveTransaction,
  findUserRatingTable,
  findUserScoreTable,
  getUserRating,
  getUserScore,
  updateUserRating,
  updateUserScore,
} from '../../db/game/game.db.js';
import { getGameSession } from '../../sessions/game.session.js';
import { getUserBySocket } from '../../sessions/user.session.js';
import { createGameEndPacket } from '../../utils/notification/game.notification.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import CustomError from '../../utils/error/customError.js';

export const gameEndHandler = async ({ socket, userId, data }) => {
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
    //   sessionId: 'abcddd123',
    //   users: [
    //     { playerId: 'aaa', characterId: 1, socket: 'a', kill: 2, death: 0, damage: 112 },
    //     { playerId: 'mmm', characterId: 2, socket: 'b', kill: 0, death: 0, damage: 88 },
    //     { playerId: 'qqq', characterId: 3, socket: 'c', kill: 0, death: 0, damage: 21 },
    //     { playerId: 'xxx', characterId: 4, socket: 'd', kill: 0, death: 0, damage: 0 },
    //   ],
    // };

    const users = gameSession.users;
    //현재 서버에서 관리하는 게임세션에는 redTeam blueTeam이 구분이 안되어있어서 매치큐에서 편성하는 코드 긁어옴
    // const players = gameSession.users.splice(0, 4);
    // const redTeam = players.slice(0, 2);
    // const blueTeam = players.slice(2, 4);
    // const myTeam = redTeam.some((user) => user.socket === 'b');
    // const winnerTeamState = myTeam ? 'Win' : 'Lose';
    // const winnerTeam = myTeam ? 'RedTeam' : 'BlueTeam';
    // const loserTeamState = !myTeam ? 'Win' : 'Lose';
    // const winTeam = myTeam ? redTeam : blueTeam;
    // const loseTeam = !myTeam ? redTeam : blueTeam;

    const me = gameSession.getUser(playerId);
    const winTeamColor = me.team;
    const loseTeamColor = me.team === 'red' ? 'blue' : 'red';
    const winTeam = users.filter((user) => user.team === winTeamColor);
    const loseTeam = users.filter((user) => user.team === loseTeamColor);

    let startTime = Date.now();

    for (let i = 1; i < 4; i++) {
      try {
        await dbSaveTransaction(winTeam, loseTeam, users, gameSession, winTeamColor, startTime);
        break;
      } catch (err) {
        console.error(`db저장 실패 ${i}번째 시도 중..,${err.message}`);
        if (i === 3) {
          console.log('3번 모두 저장 실패!');
          //db저장 수작업해야하니 추후에 추가
        }
      }
    }

    const allUsers = [
      { playerId: 'abc', kill: 2, death: 0 },
      { playerId: 'def', kill: 0, death: 0 },
      { playerId: 'ghi', kill: 0, death: 1 },
      { playerId: 'jkl', kill: 0, death: 1 },
    ];

    const winPayload = {
      result: winnerTeamState,
      users: allUsers,
    };
    const losePayload = {
      result: loserTeamState,
      users: allUsers,
    };

    const winPacket = createGameEndPacket(winPayload);
    const losePacket = createGameEndPacket(losePayload);

    //패킷 통지
    winTeam.forEach((user) => user.socket.write(winPacket));
    loseTeam.forEach((user) => user.socket.write(losePacket));

    // //패킷 통지
    // socket.write(packet);
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
      const findUserRating = await findUserRatingTable(connection, user.playerId);
      if (!findUserRating) {
        await createUserRating(connection, user.playerId, user.characterId, 1, 0);
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
      const findUserRating = await findUserRatingTable(connection, user.playerId);
      if (!findUserRating) {
        await createUserRating(connection, user.playerId, user.characterId, 0, 1);
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
