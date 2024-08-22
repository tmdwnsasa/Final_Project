import net from 'net';
import express from 'express';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';
import { verifySignature } from './utils/webHook/verifySignature.js';
import bodyParser from 'body-parser';
import webHookRouter from './handlers/webHook/webHookRouter.js';
import updateRouter from './handlers/update/updateAnnounce.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다`);
      console.log(server.address());
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

//CI CD 용 express 서버 - git push 감지 & git pull & 서버 재시작 & discord 알림
const app = express();
const HTTP_PORT = 4000;

app.use(bodyParser.json({ verify: verifySignature }));
app.use('/api/webhook', bodyParser.json({ verify: verifySignature }), webHookRouter);
app.use('/api/updateAnnounce', updateRouter);
app.listen(HTTP_PORT, () => {
  console.log(`CI/CD용 HTTP 서버 ${HTTP_PORT}에서 실행 중입니다`);
});
