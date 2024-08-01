import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log('DB서버 시작됨 :', PORT);
});
