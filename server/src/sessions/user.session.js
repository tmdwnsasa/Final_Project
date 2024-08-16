import User from '../classes/models/user.class.js';
import { createCreateUserPacket, createRemoveUserPacket } from '../utils/notification/game.notification.js';
import { getLobbySession } from './lobby.session.js';
import { userSessions } from './session.js';

export const addUser = (playerId, name, guild, socket, sessionId) => {
  const user = new User(playerId, name, guild, socket, sessionId);
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

export const createUserInClient = (user) => {
  const lobbySesssion = getLobbySession();
  const users = lobbySesssion.getAllUsers();

  users.forEach((data) => {
    if (user.playerId !== data.playerId) {
      const packet = createCreateUserPacket({
        name: user.name,
        characterId: user.characterId - 1,
        guild: user.guild,
      });
      data.socket.write(packet);
    }
  });
};

export const deleteUserInClient = (playerId) => {
  const lobbySesssion = getLobbySession();
  const users = lobbySesssion.getAllUsers();
  const removedUser = getUserById(playerId);

  users.forEach((data) => {
    if (removedUser.playerId !== data.playerId) {
      const packet = createRemoveUserPacket({
        name: removedUser.name,
        characterId: removedUser.characterId - 1,
      });
      data.socket.write(packet);
    }
  });
};
