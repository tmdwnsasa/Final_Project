//서버 업데이트에 대한 내용
import express from 'express';
import { getAllUsers } from '../../sessions/user.session.js';
import { createChattingPacket } from '../../utils/notification/game.notification.js';
const updateRouter = express.Router();

export const updateAnnounce = (req, res) => {
  try {
    const { message } = req.body;
    const users = getAllUsers();
    const packet = createChattingPacket(`<color=red>알림</color>`, `<color=red>${message}.</color>`, '1');
    users.forEach((user) => {
      user.socket.write(packet);
    });
    console.log(`[서버]:${message}`);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json(error);
  }
};
//테스트
export const autoAnnounce = () => {
  try {
    const users = getAllUsers();
    const packet = createChattingPacket(
      `<color=red>알림</color>`,
      `<color=red>서버가 재시작됩니다. 게임 곧 꺼집니다.</color>`,
      '1',
    );
    users.forEach((user) => {
      user.socket.write(packet);
    });
  } catch (error) {
    console.error(error);
  }
};

updateRouter.post('/', updateAnnounce);

export default updateRouter;
