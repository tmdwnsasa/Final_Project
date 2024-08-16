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

export const sendGitPushAlert = async (commitMessage, pusher,url) => {
  const message = {
    content: `게임서버에 git push를 하셨더라구요~ 
  ${commitMessage}
  ${getTeamMateName(pusher)} 님께서 올려주셨는데 그러면 서버 바로 다시 시작할께요?
  [내용 보러 github로 가기]{${url}}
  감사합니다~ 감사합니다~!`,
  };

  try {
    await axios.post(webHookUrl, message);
  } catch (error) {
    console.log('Discord로 에러 메세지를 보내는데 실패했습니다', error);
  }
};
