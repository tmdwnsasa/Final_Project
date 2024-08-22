//서버 업데이트에 대한 내용
import express from 'express';
import { getAllUsers } from '../../sessions/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
const updateRouter = express.Router();

const updateAnnounce = () => {
  const users = getAllUsers();
  const packet = "?";
  users.forEach((user) => {
    user.socket.write(packet);
  });
};

updateRouter.post('/', updateAnnounce);

export default updateRouter;
