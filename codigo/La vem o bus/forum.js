const form = document.querySelector('form');
const commentsList = document.querySelector('.comments');

form.addEventListener('submit', (event) => {

  event.preventDefault();

  
  const username = document.querySelector('#username').value;
  const comment = document.querySelector('#comment').value;

  
  const newComment = document.createElement('div');
  newComment.classList.add('comment');
  newComment.innerHTML = `
    <p class="author">${username}</p>
    <p class="date">${new Date().toLocaleDateString()}</p>
    <p class="text">${comment}</p>
  `;

  
  commentsList.appendChild(newComment);

  
  document.querySelector('#comment').value = '';
});


