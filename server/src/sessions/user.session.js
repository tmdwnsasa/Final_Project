import User from '../classes/models/user.class.js';
import { userSessions } from './session.js';

export const addUser = (playerId, characterId, name, socket, sessionId) => {
  const user = new User(playerId, characterId, name, socket, sessionId);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.playerId === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};

export const getAllUsers = () => {
  return userSessions;
};
