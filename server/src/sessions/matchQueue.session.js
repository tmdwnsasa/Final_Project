import { matchQueueSession } from './session.js';
import { getUserBySocket } from './user.session.js';

export const addUserToQueue = (socket) => {
  const user = getUserBySocket(socket);
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

export const getUsersForGame = () => {
  if (matchQueueSession.length >= 4) {
    return matchQueueSession.splice(0, 4);
  }
  return null;
};

