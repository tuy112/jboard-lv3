// DOM이 로드된 후 실행되는 함수
document.addEventListener('DOMContentLoaded', function () {
    // 게시글 목록을 가져와서 화면에 표시하는 함수
    function displayPosts(posts) {
      const postList = document.querySelector('#post-list tbody');
      postList.innerHTML = '';
  
      // 각 게시글에 대해 템플릿을 렌더링하고 게시글 목록 테이블에 추가
      posts.forEach(function (post) {
        const renderedTemplate = Mustache.render(postTemplate, post);
        postList.innerHTML += renderedTemplate;
      });
    }
  
    // 댓글 목록을 가져와서 화면에 표시하는 함수
    function displayComments(comments) {
      const commentList = document.querySelector('#comment-list tbody');
      commentList.innerHTML = '';
  
      // 각 댓글에 대해 템플릿을 렌더링하고 댓글 목록 테이블에 추가
      comments.forEach(function (comment) {
        const renderedTemplate = Mustache.render(commentTemplate, comment);
        commentList.innerHTML += renderedTemplate;
      });
    }
  
    // 서버로부터 게시글 목록을 가져와서 화면에 표시하는 요청
    fetch('/api/posts')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayPosts(data.posts);
      })
      .catch(function (error) {
        console.error(error);
      });
  
    // 서버로부터 댓글 목록을 가져와서 화면에 표시하는 요청
    fetch('/api/comments')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayComments(data.comments);
      })
      .catch(function (error) {
        console.error(error);
      });
  });
  
  
  // commentBtn
  document.getElementById('comment-submit').addEventListener('click', function () {
    // 작성자와 댓글 내용을 가져옴
    const author = document.getElementById('comment-author').value;
    const content = document.getElementById('comment-content').value;
  
    // 작성자와 댓글 내용이 모두 입력되었는지 확인
    if (author && content) {
      // 서버로 데이터 전송하여 MongoDB에 저장
      fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author: author, content: content })
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // 저장된 댓글 데이터를 받아와 화면에 추가
        displayComments(data.comments);
      })
      .catch(function (error) {
        console.error(error);
      });
  
      // 입력 필드 초기화
      document.getElementById('comment-author').value = '';
      document.getElementById('comment-content').value = '';
    }
  });