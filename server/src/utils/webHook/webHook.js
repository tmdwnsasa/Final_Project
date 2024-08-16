import axios from 'axios';
import { config } from '../../config/config.js';

const webHookUrl = config.webHook.DISCORD_WEB_HOOK;

export const sendGitPushAlert = async (commitMessage, pusher) => {
  const message = {
    content: `게임서버에 git push를 하셨더라구요~ 
    커밋 메세지는 ${commitMessage} 이고 ${pusher} 님께서 올려주셨는데 그러면 서버 바로 다시 시작할께요?
    감사합니다~ 감사합니다~!`,
  };

  try {
    await axios.post(webHookUrl, message);
  } catch (error) {
    console.log('Discord로 에러 메세지를 보내는데 실패했습니다');
  }
};
