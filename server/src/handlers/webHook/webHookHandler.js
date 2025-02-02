import dotenv from 'dotenv';
import simpleGit from 'simple-git';
import { exec } from 'child_process';
import { sendGitPushAlert } from '../../utils/webHook/discord.js';
import { autoAnnounce } from '../update/updateAnnounce.js';
dotenv.config();

const REPO_DIR = process.env.REPO_DIR;
const PM2_PROCESS_NAME = process.env.PM2_PROCESS_NAME;

export const webHook = (req, res) => {
  console.log('git 이벤트 발생');
  if (req.body.ref === 'refs/heads/dev') {
    // dev 브랜치에 push 이벤트 발생 시
    const git = simpleGit(REPO_DIR);
    git.pull(async (err, update) => {
      if (err) {
        console.error('Git pull failed:', err);
        return res.status(500).send('Git pull failed');
      }

      if (update && update.summary.changes) {
        await sendGitPushAlert(req.body.commits[0].message, req.body.pusher.name);
        autoAnnounce();
        exec(`pm2 restart ${PM2_PROCESS_NAME}`, (err, stdout, stderr) => {
          if (err) {
            console.error('PM2 restart failed:', err);
            return res.status(500).send('PM2 restart failed');
          }
          console.log('PM2 process restarted successfully');
          res.status(200).send('Webhook handled, PM2 process restarted');
        });
      } else {
        res.status(200).send('No changes detected');
      }
    });
  } else {
    res.status(200).send('Not a push to the main branch, ignoring');
  }
};
