// script.js
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.login-form form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const captchaInput = document.getElementById('captcha');
    const captchaImage = document.querySelector('.captcha-image img');
    const errorMessage = document.createElement('div');
    errorMessage.style.display = 'none';
    errorMessage.style.color = 'red';
    errorMessage.style.marginBottom = '1rem';
    loginForm.insertBefore(errorMessage, loginForm.firstChild);

    function generateCaptcha() {
        const captchaText = Math.random().toString(36).substr(2, 6).toUpperCase();
        captchaImage.setAttribute('alt', captchaText);
        captchaImage.setAttribute('src', `https://dummyimage.com/150x50/cccccc/000000&text=${captchaText}`);
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (emailInput.value === '' || passwordInput.value === '' || captchaInput.value === '') {
            errorMessage.textContent = 'Por favor, preencha todos os campos.';
            errorMessage.style.display = 'block';
        } else if (captchaInput.value !== captchaImage.getAttribute('alt')) {
            errorMessage.textContent = 'O código CAPTCHA está incorreto. Tente novamente.';
            errorMessage.style.display = 'block';
            generateCaptcha();
        } else {
            errorMessage.style.display = 'none';
            window.location.href = 'Menu.html';
        }
    });

    captchaImage.addEventListener('click', function () {
        generateCaptcha();
    });

    generateCaptcha();
});
