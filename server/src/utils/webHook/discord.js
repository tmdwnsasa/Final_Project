import axios from 'axios';
import { config } from '../../config/config.js';

const webHookUrl = config.webHook.DISCORD;

const teamMate = {
  '4cozm': '홍걸',
  diddntjd99: '우성',
  tmdwnsasa: '윤제',
  quahsim: '규아',
  nalyn87: '나린',
  rladmswlr: '은직',
  moonhyunhu: '현후',
};

function getTeamMateName(gitUsername) {
  return teamMate[gitUsername] || '외부인'; // 매칭되는 이름이 없을 경우
}

export const sendGitPushAlert = async (commitMessage, pusher) => {
  const message = {
    content: `게임서버에 git push를 하셨더라구요~ 
  ${commitMessage}
  ${getTeamMateName(pusher)} 님께서 올려주셨는데 그러면 서버 바로 다시 시작할께요?
  [내용 보러 github로 가기](https://github.com/tmdwnsasa/Final_Project/commit/dev)
  감사합니다~ 감사합니다~!`,
  };

  try {
    await axios.post(webHookUrl, message);
  } catch (error) {
    console.log('Discord로 에러 메세지를 보내는데 실패했습니다', error);
  }
};

const teamMateIp = ['175.200.217.238',"117.110.62.160","14.55.170.106","182.216.209.88","172.31.160.1","211.48.53.50","59.5.130.242","14.55.170.106"];

const loginHook = config.webHook.LOGIN;
export const sendLoginAlert = async (address) => {
  if (teamMateIp.includes(address)) {
    return;
  }
  const message = {
    content: `${address}접속!! 팩트는 게임이 건강해지고 있다는거임`,
  };

  try {
    await axios.post(loginHook, message);
  } catch (error) {
    console.log('Discord로 에러 메세지를 보내는데 실패했습니다', error);
  }
};
