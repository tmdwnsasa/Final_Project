import Lobby from '../classes/models/lobby.class.js';
import { lobbySession, setLobbySession } from './session.js';

export const createLobbySession = () => {
  const session = new Lobby();
  setLobbySession(session);
  return session;
};

export const getLobbySession = () => {
  return lobbySession;
};

export const getAllUsers = () => {
  lobbySession.getAllUsers();
};
