document.addEventListener('DOMContentLoaded', function () {
  const jsonData = {
    "suggestionsForm": {
      "ids": {
        "form": "suggestions-form",
        "submitButton": "submit-button",
        "loadingIndicator": "loading-indicator",
        "sentMessage": "sent-message",
        "suggestion": "suggestion",
        "welcomeMessage": "welcome-message"
      },
      "timeout": 2000
    }
  };

  const data = jsonData.suggestionsForm;

  const form = document.querySelector(`#${data.ids.form}`);
  const submitButton = document.querySelector(`#${data.ids.submitButton}`);
  const loadingIndicator = document.querySelector(`#${data.ids.loadingIndicator}`);
  const sentMessage = document.querySelector(`#${data.ids.sentMessage}`);
  const suggestionInput = document.querySelector(`#${data.ids.suggestion}`);
  const welcomeMessage = document.querySelector(`#${data.ids.welcomeMessage}`);

  const userEmail = localStorage.getItem('email');

  const confirmation = document.querySelector('.confirmation');
  const confirmationMessage = document.querySelector('#confirmation-message');
  const confirmButton = document.querySelector('#confirm-button');
  const deleteButton = document.querySelector('#delete-button');

  const suggestionsHistory = document.querySelector('.suggestions-history');

  if (userEmail) {
    welcomeMessage.textContent = `Olá, envie uma sugestão para nossa equipe.`;
  } else {
    welcomeMessage.textContent = 'Por favor, faça login para enviar uma sugestão.';
  }

  function addToHistory(suggestion) {
    const listItem = document.createElement('li');
    listItem.textContent = suggestion;

    const deleteSuggestionButton = document.createElement('button');
    deleteSuggestionButton.textContent = 'Excluir';
    deleteSuggestionButton.addEventListener('click', () => {
      const suggestions = JSON.parse(localStorage.getItem('suggestions') || '[]');
      const index = suggestions.indexOf(suggestion);
      if (index > -1) {
        suggestions.splice(index, 1);
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
      }
      suggestionsHistory.removeChild(listItem);
    });

    listItem.appendChild(deleteSuggestionButton);
    suggestionsHistory.appendChild(listItem);
  }

  function storeSuggestion(suggestion) {
    let suggestions = localStorage.getItem('suggestions');
    suggestions = suggestions ? JSON.parse(suggestions) : [];

    suggestions.push(suggestion);
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
    addToHistory(suggestion);
  }

  function loadSuggestions() {
    const suggestions = localStorage.getItem('suggestions');
    if (suggestions) {
      JSON.parse(suggestions).forEach(suggestion => addToHistory(suggestion));
    }
  }

  loadSuggestions();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!userEmail) {
      alert('Por favor, faça login para enviar uma sugestão.');
      return;
    }

    confirmationMessage.textContent = `Você gostaria de enviar a seguinte sugestão: "${suggestionInput.value}"?`;
    confirmation.style.display = 'block';
  });

  confirmButton.addEventListener('click', () => {
    confirmation.style.display = 'none';

    loadingIndicator.style.display = 'block';
    submitButton.disabled = true;

    setTimeout(() => {
      loadingIndicator.style.display = 'none';
      sentMessage.style.display = 'block';
      storeSuggestion(suggestionInput.value);
      form.classList.add('sent');
      suggestionInput.value = '';
    }, data.timeout);
  });

  deleteButton.addEventListener('click', () => {
    confirmation.style.display = 'none';
    suggestionInput.value = '';
  });
});
// Botão de dados mock/fake
const testLoginButton = document.querySelector('#test-login-button');

testLoginButton.addEventListener('click', () => {
  // Simula o login do usuário, armazenando um endereço de e-mail fictício no localStorage
  localStorage.setItem('email', 'test@example.com');

  // Atualiza a página
  location.reload();
});
