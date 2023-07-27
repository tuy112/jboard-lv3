const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

// cookie parser
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/usersRoute.js');
const postsRouter = require('./routes/postsRoute.js');

// Middleware ==================================================
app.use(express.json()); // req.body parser
app.use(cookieParser()); // cookie parser
app.use(cors()); // front-back connect

// localhost:3000/api/
app.use('/api', [usersRouter]);
app.use('/api', [postsRouter]);
// Middleware ==================================================

// HTML, CSS
app.use(express.static(path.join(__dirname, 'assets')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets', 'index.html'));
});

// server start!!
app.listen(port, () => {
    console.log(port, '서버가 켜졌습니다.');
});
