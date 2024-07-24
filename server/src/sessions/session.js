export const userSessions = [];
export const gameSessions = [];
export const matchMakingSessions = [];
let lobbySession;

export const setLobbySession = (session) => {
  lobbySession = session;
};

export const getLobbySession = () => {
  return lobbySession;
};
