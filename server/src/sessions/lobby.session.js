import Lobby from '../classes/models/lobby.class.js';
import { setLobbySession } from './session.js';

export const createLobbySession = () => {
  const session = new Lobby();
  setLobbySession(session);
  return session;
};
