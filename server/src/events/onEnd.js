import { gameSessions, userSessions } from "../sessions/session.js";
import { removeUser } from "../sessions/user.session.js";

export const onEnd = (socket) => () => {
  console.log('클라이언트 연결이 종료되었습니다');

  console.log(userSessions);
  console.log(gameSessions);

  // 세션에서 유저 삭제
  removeUser(socket);
};
