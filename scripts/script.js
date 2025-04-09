document.addEventListener('DOMContentLoaded', function () {
    const loginLogoutButton = document.getElementById('loginLogoutButton');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
    const loggedInElements = document.querySelectorAll('.logged-in');
    const getStartedNowButton = document.querySelector('.cta-button');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const loginLinkFromSignup = document.getElementById('loginLink');
    const signupLinkFromLogin = document.getElementById('signupLink');

    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || false;

    function updateLoginUI() {
        if (isLoggedIn) {
            loginLogoutButton.textContent = 'Logout';
            loggedInElements.forEach(el => el.style.display = 'block');
            getStartedNowButton.textContent = 'Go to Your Books';
        } else {
            loginLogoutButton.textContent = 'Login';
            loggedInElements.forEach(el => el.style.display = 'none');
            getStartedNowButton.textContent = 'Get Started Now';
        }
    }

    updateLoginUI();

    const handleLogin = (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const storedPassword = localStorage.getItem(email);

        if (storedPassword && storedPassword === password) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            updateLoginUI();
            loginModal.hide();
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            window.location.href = 'pages/dashboard.html';
        } else {
            alert('Login failed. Incorrect email or password.');
        }
    };

    const handleLogout = () => {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        updateLoginUI();
        window.location.href = 'index.html';
    };

    loginLogoutButton.addEventListener('click', function () {
        if (isLoggedIn) {
            handleLogout();
        } else {
            loginModal.show();
        }
    });

    loggedInElements.forEach(el => {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            if (isLoggedIn) {
                window.location.href = '../pages/dashboard.html';
            } else {
                loginModal.show();
            }
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupLinkFromLogin) {
        signupLinkFromLogin.addEventListener('click', function (event) {
            event.preventDefault();
            loginModal.hide();
            signupModal.show();
        });
    }

    if (loginLinkFromSignup) {
        loginLinkFromSignup.addEventListener('click', function (event) {
            event.preventDefault();
            signupModal.hide();
            loginModal.show();
        });
    }

    if (getStartedNowButton) {
        getStartedNowButton.addEventListener('click', function () {
            if (isLoggedIn) {
                window.location.href = '../pages/dashboard.html';
            } else {
                loginModal.show();
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const nameInput = document.getElementById('name');
            const signupEmailInput = document.getElementById('signupEmail');
            const contactInput = document.getElementById('contact');
            const signupPasswordInput = document.getElementById('signupPassword');

            const name = nameInput.value.trim();
            const email = signupEmailInput.value.trim();
            const contact = contactInput.value.trim();
            const password = signupPasswordInput.value.trim();

            localStorage.setItem(email, password);
            alert('Signup successful! You can now log in.');
            signupModal.hide();
            loginModal.show();
            signupForm.reset();
        });
    }
});