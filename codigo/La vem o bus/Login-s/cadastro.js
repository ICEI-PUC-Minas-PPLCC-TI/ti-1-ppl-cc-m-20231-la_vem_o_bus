document.addEventListener('DOMContentLoaded', function () {
    const jsonData = {
        "registerForm": {
            "ids": {
                "emailInput": "email",
                "passwordInput": "password",
                "passwordConfirmInput": "password2",
                "captchaInput": "captcha"
            },
            "errorMessages": {
                "emptyFields": "Por favor, preencha todos os campos.",
                "incorrectCaptcha": "O código CAPTCHA está incorreto. Tente novamente.",
                "passwordMismatch": "Senhas devem ser iguais!"
            }
        }
    };

    const data = jsonData;

    const registerForm = document.querySelector('.login-form form');
    const emailInput = document.getElementById(data.registerForm.ids.emailInput);
    const passwordInput = document.getElementById(data.registerForm.ids.passwordInput);
    const passwordConfirmInput = document.getElementById(data.registerForm.ids.passwordConfirmInput);
    const captchaInput = document.getElementById(data.registerForm.ids.captchaInput);
    const captchaImage = document.querySelector('.captcha-image img');
    const errorMessage = document.createElement('div');
    errorMessage.style.display = 'none';
    errorMessage.style.color = 'red';
    errorMessage.style.marginBottom = '1rem';
    registerForm.insertBefore(errorMessage, registerForm.firstChild);

    function generateCaptcha() {
        const captchaText = Math.random().toString(36).substr(2, 6).toUpperCase();
        captchaImage.setAttribute('alt', captchaText);
        captchaImage.setAttribute('src', `https://dummyimage.com/150x50/cccccc/000000&text=${captchaText}`);
    }

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        if (emailInput.value === '' || passwordInput.value === '' || passwordConfirmInput.value === '' || captchaInput.value === '') {
            errorMessage.textContent = data.registerForm.errorMessages.emptyFields;
            errorMessage.style.display = 'block';
            return;
        } else if (captchaInput.value !== captchaImage.getAttribute('alt')) {
            errorMessage.textContent = data.registerForm.errorMessages.incorrectCaptcha;
            errorMessage.style.display = 'block';
            generateCaptcha();
            return;
        } else if (passwordInput.value !== passwordConfirmInput.value) {
            errorMessage.textContent = data.registerForm.errorMessages.passwordMismatch;
            errorMessage.style.display = 'block';
            return;
        } else {
            errorMessage.style.display = 'none';
    
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users.push({
                email: emailInput.value,
                password: passwordInput.value
            });
            localStorage.setItem('users', JSON.stringify(users));
    
            alert('Cadastro bem sucedido!');
            window.location.href='login.html';
        }
    });
    generateCaptcha();
});


