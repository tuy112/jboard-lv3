// app.js

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

app.get('/', (req, res, next) => {
    res.status(200).json({
        path: {
            user: {
                1: 'POST /api/signup 회원가입',
                2: 'POST /api/login 로그인',
                3: 'POST /api/logout 로그아웃',
                4: 'GET /api/users/:userId 사용자 정보 조회',
                5: 'PUT /api/users/:userId 사용자 정보 수정',
            },
            post: {
                1: 'GET /api/posts 게시글 목록 조회',
                2: 'POST /api/posts 게시글 작성',
                3: 'PUT /api/posts/:postId 게시글 수정',
                4: 'DELETE /api/posts/:postId 게시글 삭제',
            },
        },
    });
});

// server start!!
app.listen(port, () => {
    console.log(port, '서버가 켜졌습니다.');
});
