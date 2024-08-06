import express from 'express';
import dbRouter from './router/dbRouter.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/db', dbRouter);

app.listen(PORT, () => {
  console.log('DB서버 시작됨 :', PORT);
});
