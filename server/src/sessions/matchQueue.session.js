import { matchQueueSession } from './session.js';

export const addUserToQueue = (user) => {
  matchQueueSession.push(user);

};

export const removeUserFromQueue = (socket) => {
  const index = matchQueueSession.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return matchQueueSession.splice(index, 1)[0];
  }
  return null;
};

export const getQueueLength = () => matchQueueSession.length;


export const getAllPlayersInQueue = () => {
  return matchQueueSession.map(user => user.playerId);
};

export const getUsersForGame = () => {
  return matchQueueSession;
};

