const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) =>{
    res.send('hello world');
});

app.listen(port, () => {
    console.log(port, '포트가 열렸습니다아^^');
});