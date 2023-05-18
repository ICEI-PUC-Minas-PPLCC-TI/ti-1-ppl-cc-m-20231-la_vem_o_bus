document.addEventListener('DOMContentLoaded', function () {
    const jsonData = {
        "loginForm": {
            "ids": {
                "emailInput": "email",
                "passwordInput": "password",
                "captchaInput": "captcha"
            },
            "errorMessages": {
                "emptyFields": "Por favor, preencha todos os campos.",
                "incorrectCaptcha": "O código CAPTCHA está incorreto. Tente novamente."
            },
            "navigation": {
                "menuPage": "Menu.html"
            }
        }
    };

    localStorage.setItem('loginFormData', JSON.stringify(jsonData));
    const data = JSON.parse(localStorage.getItem('loginFormData'));

    const loginForm = document.querySelector('.login-form form');
    const emailInput = document.getElementById(data.loginForm.ids.emailInput);
    const passwordInput = document.getElementById(data.loginForm.ids.passwordInput);
    const captchaInput = document.getElementById(data.loginForm.ids.captchaInput);
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

    function isUserLoggedIn() {
        return localStorage.getItem('email') !== null && localStorage.getItem('password') !== null;
    }

    function toggleLoginState() {
        const loginForm = document.querySelector('.login-form');
        const userInfo = document.querySelector('.user-info');
        const captcha = document.querySelector('.captcha');
        const userEmail = document.getElementById('user-email');

        if (isUserLoggedIn()) {
            userEmail.textContent = localStorage.getItem('email');
            loginForm.style.display = 'none';
            captcha.style.display = 'none';
            userInfo.style.display = 'flex';
        } else {
            loginForm.style.display = 'block';
            captcha.style.display = 'block';
            userInfo.style.display = 'none';
        }
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (emailInput.value === '' || passwordInput.value === '' || captchaInput.value === '') {
            errorMessage.textContent = data.loginForm.errorMessages.emptyFields;
            errorMessage.style.display = 'block';
            return;
        } else if (captchaInput.value !== captchaImage.getAttribute('alt')) {
            errorMessage.textContent = data.loginForm.errorMessages.incorrectCaptcha;
            errorMessage.style.display = 'block';
            generateCaptcha();
            return;
        } else {
            errorMessage.style.display = 'none';
            let users = JSON.parse(localStorage.getItem('users')) || [];
            let userExists = users.some(user => user.email === emailInput.value && user.password === passwordInput.value);
            if (userExists) {
                // User is logged in, you can set this in local storage or in a variable in your app
                localStorage.setItem('email', emailInput.value);
                localStorage.setItem('password', passwordInput.value);
                alert('Login bem sucedido!');
                window.location.href = '/Login-s/login.html';
            } else {
                alert('Email ou senha incorretos!');
            }
        }
    });

    captchaImage.addEventListener('click', function () {
        generateCaptcha();
    });

    // Add event listener to the logout button
    document.getElementById('logout-btn').addEventListener('click', function () {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        toggleLoginState();
    });

    // Register a new user
    document.getElementById('test-login-button').addEventListener('click', function () {
        const newUser = {
            email: 'test@example.com',
            password: 'test123'
        };

        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Usuário registrado com sucesso!');
    });

    generateCaptcha();
    toggleLoginState();
});


