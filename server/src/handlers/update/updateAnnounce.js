//서버 업데이트에 대한 내용
import express from 'express';
import { getAllUsers } from '../../sessions/user.session.js';
import { createServerNotificationPacket } from '../../utils/notification/game.notification.js';
const updateRouter = express.Router();

const updateAnnounce = (req, res) => {
  try {
    const users = getAllUsers();
    const packet = createServerNotificationPacket();
    users.forEach((user) => {
      user.socket.write(packet);
    });
    res.status(200).json({ message: 'done' });
  } catch (error) {
    res.status(500).json(error);
  }
};

updateRouter.post('/', updateAnnounce);

export default updateRouter;
