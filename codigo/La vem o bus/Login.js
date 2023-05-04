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
        } else if (captchaInput.value !== captchaImage.getAttribute('alt')) {
            errorMessage.textContent = data.loginForm.errorMessages.incorrectCaptcha;
            errorMessage.style.display = 'block';
            generateCaptcha();
        } else {
            errorMessage.style.display = 'none';
            localStorage.setItem('email', emailInput.value);
            localStorage.setItem('password', passwordInput.value);
            toggleLoginState();
        }
    });

    captchaImage.addEventListener('click', function () {
        generateCaptcha();
    });

    // Add event listener to the logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        toggleLoginState();
    });

    generateCaptcha();
    toggleLoginState();
});
