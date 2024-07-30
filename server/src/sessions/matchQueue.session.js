import createGameHandler from '../handlers/game/createGame.handler.js';
import { matchQueueSession } from './session.js';
import { getUserBySocket } from './user.session.js';
import User from '../classes/models/user.class.js';

export const addUserinQueue = (socket, data) => {
  const user = getUserBySocket(socket);

  console.log('User added to queue:', user.playerId);
  // console.log('Instance of User:', user instanceof User); //디버깅용
  matchQueueSession.push(user);

  console.log(`User ${user.playerId} added to match queue. Queue length: ${matchQueueSession.length}`);

  // 매치큐에 4명 이상일 때, 팀편성 및 게임 세션 생성
  if (matchQueueSession.length >= 4) {
    const players = matchQueueSession.splice(0, 4);

    // 2팀으로 편성
    const redTeam = players.slice(0, 2); //첫 2유저
    const blueTeam = players.slice(2, 4); //마지막 2유저

    console.log(`팀 편성 완료: Red Team - ${redTeam.map(player => player.playerId).join(', ')}, Blue Team - ${blueTeam.map(player => player.playerId).join(', ')}`);


    // createGame 핸들러로 전송
    createGameHandler({
        redTeam: redTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        blueTeam: blueTeam.map((player) => ({ socket: player.socket, id: player.playerId })),
        payload: data,
      });

      console.log(`Users remaining in queue: ${matchQueueSession.map(user => user.id).join(', ')}`);

    }
  return user;
};

// export const removeUserfromQueue = (socket) => {
//   const index = matchQueueSession.findIndex((user) => user.socket === socket);
//   if (index !== -1) {
//     return matchQueueSession.splice(index, 1)[0];
//   }
//   return null;
// };
