const form = document.querySelector('#suggestions-form');
const submitButton = document.querySelector('#submit-button');
const loadingIndicator = document.querySelector('#loading-indicator');
const sentMessage = document.querySelector('#sent-message');

form.addEventListener('submit', (event) => {
  event.preventDefault();

   
  loadingIndicator.style.display = 'block';
  submitButton.disabled = true;


  setTimeout(() => {
    
    loadingIndicator.style.display = 'none';

   
    sentMessage.style.display = 'block';

  
    form.classList.add('sent');
  }, 2000);
});
