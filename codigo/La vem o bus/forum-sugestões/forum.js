document.addEventListener('DOMContentLoaded', function () {
  // Função para verificar se o usuário está logado
  function isLoggedIn() {
    const email = localStorage.getItem('email');
    return email || null;
  }

  // Verifica se o usuário está logado
  let userEmail = isLoggedIn();

  if (userEmail) {
    // Obtém as rotas salvas do usuário logado
    let savedRoutes = JSON.parse(localStorage.getItem(userEmail)) || [];

    // Obtém o elemento select das rotas
    let routesSelect = document.getElementById('routes');

    // Adiciona as opções de rota ao select
    savedRoutes.forEach((route, index) => {
      let option = document.createElement('option');
      option.value = index;
      option.text = route.name;
      routesSelect.appendChild(option);
    });
  }

  // Obtém as publicações salvas no armazenamento local
  let savedPublications = JSON.parse(localStorage.getItem('publications')) || [];

  // Adiciona as publicações existentes ao fórum
  savedPublications.forEach((publication) => {
    addPublication(publication);
  });
});

// Função para publicar uma rota no fórum
function publishRoute(event) {
  event.preventDefault();

  // Obtém os valores dos campos de entrada
  let routeNameInput = document.getElementById('route-name');
  let routeDescriptionInput = document.getElementById('route-description');
  let routesSelect = document.getElementById('routes');

  // Obtém o índice da rota selecionada
  let routeIndex = routesSelect.value;

  // Obtém o email do usuário logado
  let userEmail = localStorage.getItem('email');
  let savedRoutes = JSON.parse(localStorage.getItem(userEmail)) || [];

  // Obtém a rota selecionada
  let selectedRoute = savedRoutes[routeIndex];

  // Cria um objeto de publicação com os dados fornecidos
  let publication = {
    routeName: routeNameInput.value,
    routeDescription: routeDescriptionInput.value,
    route: JSON.parse(JSON.stringify(selectedRoute)), // Cria uma cópia profunda da rota
    likes: 0,
    comments: [],
  };

  // Adiciona a publicação ao fórum
  addPublication(publication);

  // Salva a publicação no armazenamento local
  let savedPublications = JSON.parse(localStorage.getItem('publications')) || [];
  savedPublications.push(publication);
  localStorage.setItem('publications', JSON.stringify(savedPublications));

  // Limpa os campos de entrada do formulário
  routeNameInput.value = '';
  routeDescriptionInput.value = '';
  routesSelect.selectedIndex = 0;
}

// Função para adicionar uma publicação ao fórum
function addPublication(publication) {
  // Obtém o elemento que contém as publicações
  let publicationsContainer = document.querySelector('.publications');

  // Cria um elemento de publicação
  let publicationElement = document.createElement('div');
  publicationElement.classList.add('publication');

  // Adiciona o título da rota à publicação
  let titleElement = document.createElement('h3');
  titleElement.textContent = publication.routeName;
  publicationElement.appendChild(titleElement);

  // Adiciona a descrição da rota à publicação
  let descriptionElement = document.createElement('p');
  descriptionElement.textContent = publication.routeDescription;
  publicationElement.appendChild(descriptionElement);

  // Adiciona o botão "Iniciar Rota" à publicação
  let startButton = document.createElement('button');
  startButton.textContent = 'Iniciar Rota';
  startButton.addEventListener('click', function () {
    // Armazena a rota selecionada no armazenamento local
    localStorage.setItem('selectedRoute', JSON.stringify(publication.route));
    // Redireciona para a página "acompanhar-rota.html"
    location.href = '../minhas-rotas/acompanhar-rota.html';
  });
  publicationElement.appendChild(startButton);

  // Container dos likes
  let likesContainer = document.createElement('div');
  likesContainer.classList.add('likes-container');

  // Botão de like
  let likeButton = document.createElement('button');
  likeButton.classList.add('heart-button', 'outline');
  likeButton.addEventListener('click', toggleLike);
  let likeIcon = document.createElement('i');
  likeIcon.classList.add('fas', 'fa-heart');
  likeButton.appendChild(likeIcon);

  // Contador de likes
  let likesCount = document.createElement('span');
  likesCount.classList.add('likes-count');
  likesCount.textContent = publication.likes;

  // Adiciona o botão de like e o contador ao container
  likesContainer.appendChild(likeButton);
  likesContainer.appendChild(likesCount);

  // Adiciona o container de likes à publicação
  publicationElement.appendChild(likesContainer);

  // Seção de comentários
  let commentsSection = document.createElement('div');
  commentsSection.classList.add('comments-section');

  // Título dos comentários
  let commentsHeading = document.createElement('h4');
  commentsHeading.textContent = 'Comentários';
  commentsSection.appendChild(commentsHeading);

  // Lista de comentários
  let commentsList = document.createElement('ul');
  commentsList.classList.add('comments-list');
  commentsSection.appendChild(commentsList);

  // Formulário de comentário
  let commentForm = document.createElement('form');
  commentForm.addEventListener('submit', publishComment);

  let commentInput = document.createElement('input');
  commentInput.type = 'text';
  commentInput.classList.add('comment-input');
  commentInput.placeholder = 'Digite um comentário...';
  commentForm.appendChild(commentInput);

  let commentButton = document.createElement('button');
  commentButton.type = 'submit';
  commentButton.textContent = 'Publicar';
  commentForm.appendChild(commentButton);

  // Adiciona o formulário de comentário à seção de comentários
  commentsSection.appendChild(commentForm);

  // Adiciona os comentários existentes à publicação
  publication.comments.forEach((comment) => {
    addComment(comment, commentsList);
  });

  // Adiciona a seção de comentários à publicação
  publicationElement.appendChild(commentsSection);

  // Botão de exclusão da publicação
  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir Publicação';
  deleteButton.addEventListener('click', function () {
    deletePublication(publicationElement);
  });
  publicationElement.appendChild(deleteButton);

  // Adiciona a publicação ao container de publicações
  publicationsContainer.appendChild(publicationElement);
}

// Função para alternar o estado de like
function toggleLike(event) {
  let likeButton = event.target;
  let publication = likeButton.closest('.publication');
  let likesCount = publication.querySelector('.likes-count');

  if (likeButton.classList.contains('outline')) {
    likeButton.classList.remove('outline');
    likeButton.classList.add('filled');
    publication.likes = 1;
  } else {
    likeButton.classList.remove('filled');
    likeButton.classList.add('outline');
    publication.likes = 0;
  }

  likesCount.textContent = publication.likes;
}

// Função para publicar um comentário
function publishComment(event) {
  event.preventDefault();

  const commentInput = event.target.querySelector('.comment-input');
  const commentText = commentInput.value;

  if (commentText.trim() !== '') {
    const publication = commentInput.closest('.publication');
    const commentsList = publication.querySelector('.comments-list');

    const userEmail = localStorage.getItem('email');
    const commenter = userEmail ? userEmail.split('@')[0] : 'Usuário Anônimo';

    const comment = {
      commenter: commenter,
      comment: commentText,
    };

    addComment(comment, commentsList);

    commentInput.value = '';
  }
}


// Função para adicionar um comentário à lista de comentários
function addComment(comment, commentsList) {
  const commentItem = document.createElement('li');
  commentItem.classList.add('comment-box');

  const commenter = document.createElement('span');
  commenter.classList.add('commenter');
  commenter.textContent = comment.commenter;

  const commentContent = document.createElement('p');
  commentContent.classList.add('comment-content');
  commentContent.textContent = comment.comment;

  commentItem.appendChild(commenter);
  commentItem.appendChild(commentContent);

  // Botão de exclusão do comentário
  let deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir Comentário';
  deleteButton.addEventListener('click', function () {
    deleteComment(commentItem);
  });
  commentItem.appendChild(deleteButton);

  commentsList.appendChild(commentItem);
}

// Função para excluir um comentário
function deleteComment(commentElement) {
  let commentsList = commentElement.parentNode;
  commentsList.removeChild(commentElement);
}

// Função para excluir uma publicação
function deletePublication(publicationElement) {
  let publicationsContainer = publicationElement.parentNode;
  publicationsContainer.removeChild(publicationElement);

  let savedPublications = JSON.parse(localStorage.getItem('publications')) || [];
  let publicationIndex = savedPublications.findIndex((p) => p.routeName === publicationElement.querySelector('h3').textContent);

  if (publicationIndex !== -1) {
    savedPublications.splice(publicationIndex, 1);
    localStorage.setItem('publications', JSON.stringify(savedPublications));
  }
}
