/* back js */
/* 백 데이터 가져오기 */
document.addEventListener('DOMContentLoaded', async () => {
    const option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const usersDatas = await fetch('http://localhost:3000/api/users/:userId', option).then((d) => d.json());
        const postsDatas = await fetch('http://localhost:3000/api/posts', option).then((d) => d.json());

        console.log(usersDatas);
        console.log(postsDatas);
    } catch (e) {
        console.error(e);
    }
});

/* front js */
// 로그인 버튼 클릭 시
document.querySelector('.loginBtn').addEventListener('click', function (event) {
    event.preventDefault(); // 기본 동작 중단

    // 사용자명과 비밀번호 입력값 가져오기
    let userId = document.getElementById('userId').value;
    let password = document.getElementById('password').value;

    // 입력값 유효성 검사
    if (userId.trim() === '' || password.trim() === '') {
        alert('사용자명과 비밀번호를 모두 입력해주세요!');
        return;
    }

    // 로그인 요청을 서버로 보내는 코드
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, password: password }),
    }).then(function (response) {
        if (response.ok) {
            // 로그인 성공 처리
            console.log('로그인 성공');
            window.location.href = '../jboard.html';
        } else {
            // 로그인 실패 처리
            console.log('로그인 실패');
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
            window.location.href = '../index.html';
        }
    });
});

// 회원가입 버튼 클릭 시
document.querySelector('.signupBtn').addEventListener('click', function (event) {
    event.preventDefault(); // 기본 동작 중단

    window.location.href = '../signup.html';
});

// signup.html
// 회원가입완료 버튼 클릭 시
document.querySelector('.signupBtn').addEventListener('click', function (event) {
    event.preventDefault(); // 기본 동작 중단

    let userId = document.getElementById('usersId').value;
    let password = document.getElementById('password').value;
    let passwordCheck = document.getElementById('passwordCheck').value;

    // 입력값 유효성 검사
    if (userId.trim() === '' || password.trim() === '' || passwordCheck.trim() === '') {
        alert('모든 필드에 정보를 입력해주세요!');
        return;
    }

    // 회원가입 요청을 서버로 보내는 코드
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            password: password,
            passwordCheck: passwordCheck,
        }),
    }).then(function (response) {
        if (response.ok) {
            // 회원가입 성공 처리
            alert('회원가입이 완료되었습니다!');
            window.location.href = '../index.html'; // 회원가입 성공 시 로그인 페이지로 이동
        } else {
            // 회원가입 실패 처리
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    });
});
