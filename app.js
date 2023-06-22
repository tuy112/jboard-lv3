const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session)

const authRouter = require("./routes/auth");
const authCheck = require('./routes/authCheck.js');
const template = require('./templates/template.js');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store:new FileStore(),
}))

app.get('/', (req, res) => {
    // 로그인 안되어있으면 로그인 페이지로 이동
    if (!authCheck.isOwner(req, res)) {
        res.redirect('/auth/login');
        return false;
    // 로그인 되어있으면 메인 페이지로 이동
    } else {                                    
        res.redirect('/app');
        return false;
    }
})

// 인증 라우터
app.use("/auth", [authRouter]);

// 메인 페이지
app.get('/app', (req, res) => {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    if (!authCheck.isOwner(req, res)) {
        res.redirect('/auth/login');
        return false;
    }
    var html = template.HTML('Welcome',
        `<hr>
            <h2>메인 페이지에 오신 것을 환영합니다</h2>
            <p>로그인에 성공하셨습니다.</p>`,
        authCheck.statusUI(req, res)
    );
    res.send(html);
})


// port
app.listen(port, () => {
    console.log(port, '포트가 열렸습니다아^^');
});