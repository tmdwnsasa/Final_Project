import createGameHandler from '../handlers/game/createGame.handler';
import { matchQueueSession } from './session';
import { getUserBySocket } from './user.session';

export const addUserinQueue = (socket, data) => {
  const user = getUserBySocket(socket);
  matchQueueSession.push(user);

  // 매치큐에 4명 이상일 때, createGame.handler에서 게임 세션을 추가 & 큐에서 remove
  if (matchQueueSession.length >= 4) {
    const players = matchQueueSession.splice(0, 4);

    const userIds = players.map((player) => player.id);
    const sockets = players.map((player) => player.socket);

    createGameHandler({
      sockets: sockets, 
      userIds: userIds, 
      payload: data, 
    });
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
