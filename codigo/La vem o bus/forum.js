const data = {
    "formSelector": "form",
    "commentsListSelector": ".comments",
    "commentSelector": ".comment",
    "authorSelector": ".author",
    "dateSelector": ".date",
    "textSelector": ".text",
    "commentInputId": "comment"
  };
  
  const form = document.querySelector(data.formSelector);
  const commentsList = document.querySelector(data.commentsListSelector);
  
  function loadComments() {
    const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
    storedComments.forEach(comment => {
      displayComment(comment);
    });
  }
  
  function displayComment(comment) {
    const newComment = document.createElement('div');
    newComment.classList.add(data.commentSelector.slice(1));
    newComment.innerHTML = `
      <p class="${data.authorSelector.slice(1)}">${comment.username}</p>
      <p class="${data.dateSelector.slice(1)}">${comment.date}</p>
      <p class="${data.textSelector.slice(1)}">${comment.text}</p>
    `;
  
    if (localStorage.getItem('email') === comment.username) {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.addEventListener('click', () => {
        commentsList.removeChild(newComment);
        const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
        const updatedComments = storedComments.filter(storedComment => storedComment.date !== comment.date);
        localStorage.setItem('comments', JSON.stringify(updatedComments));
      });
      newComment.appendChild(deleteButton);
    }
  
    commentsList.appendChild(newComment);
  }
  
  form.addEventListener('submit', (event) => {
    event.preventDefault();
  
    const username = localStorage.getItem('email') || '';
    const commentText = document.querySelector(`#${data.commentInputId}`).value;
  
    if (username === '') {
      alert('Por favor, faça login para enviar um comentário.');
      return;
    }
  
    const comment = {
      username,
      date: new Date().toLocaleDateString(),
      text: commentText,
    };
  
    displayComment(comment);
  
    const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
    storedComments.push(comment);
    localStorage.setItem('comments', JSON.stringify(storedComments));
  
    document.querySelector(`#${data.commentInputId}`).value = '';
  });
  
  loadComments();
  



