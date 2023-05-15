document.addEventListener('DOMContentLoaded', function () {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userCardsContainer = document.querySelector('.user-cards-container');
    const userCardTemplate = document.querySelector('.user-card');

    users.forEach((user, index) => {
        const userCard = userCardTemplate.cloneNode(true);
        userCard.querySelector('.user-email').textContent = user.email;
        userCard.querySelector('.user-password').textContent = '*'.repeat(user.password.length);
        userCard.querySelector('.delete-btn').addEventListener('click', function () {
            deleteUser(index);
        });

        // Adiciona um botão de login e manipula o evento de clique
        // Adiciona um botão de login e manipula o evento de clique
        const loginButton = document.createElement('button');
        loginButton.textContent = 'Entrar';
        loginButton.classList.add('enter-btn'); // Adiciona a classe ao botão
        loginButton.addEventListener('click', function () {
            loginUser(user);
        });
        userCard.appendChild(loginButton);

        userCard.style.display = 'block';
        userCardsContainer.appendChild(userCard);
    });
});


function deleteUser(index) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userToDelete = users[index];

    // Verificar se o usuário que está sendo excluído é o usuário logado
    if (localStorage.getItem('email') === userToDelete.email) {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
    }

    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users));
    location.reload();
}

// Função para realizar o login de um usuário
function loginUser(user) {
    localStorage.setItem('email', user.email);
    localStorage.setItem('password', user.password);
    // Redireciona para a página de login
    window.location.href = 'Login.html';
}
