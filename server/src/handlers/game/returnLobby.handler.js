import { getGameSession, removeGameSession } from '../../sessions/game.session';
import { getLobbySession } from '../../sessions/lobby.session';


export const returnLobbyHandler = ({ socket, userId, data }) => {
  const gameSession = getGameSession();
  const lobbySession = getLobbySession();
  const user = gameSession.getUser(userId);
  gameSession.removeUser(userId)
  lobbySession.addUser(user);
  removeGameSession();
  const payload = {};
  const packet = createResponse(null,null,payload,userId);
  socket.write(packet);
};
