const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// html css
app.use(express.static(path.join(__dirname, 'assets')));

// 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

// 서버 시작!
app.listen(port, () => {
  console.log(port, '포트가 열렸습니다~^^');
});