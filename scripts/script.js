
document.addEventListener('DOMContentLoaded', function () {
    const loginLogoutButton = document.getElementById('loginLogoutButton');
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
    const loggedInElements = document.querySelectorAll('.logged-in');
    const getStartedNowButton = document.querySelector('.cta-button');

    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || false; // Check local storage

    // Function to update the UI based on login status
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

    // Initial UI update
    updateLoginUI();

    // Handle login form submission
    const handleLogin = (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true'); // Store login state
            updateLoginUI();
            loginModal.hide();
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            window.location.href = 'pages/dashboard.html'; // Redirect to dashboard
        } else {
            alert('Please enter your credentials!');
        }
    };

    // Handle logout
    const handleLogout = () => {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn'); // Remove login state
        updateLoginUI();
        // Redirect to the homepage
        window.location.href = 'index.html';
    };

    // Event listener for login/logout button
    loginLogoutButton.addEventListener('click', function () {
        if (isLoggedIn) {
            handleLogout();
        } else {
            loginModal.show(); // Show modal if not logged in
        }
    });

    // Event listeners for navigation links to redirect (if logged in)
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

    // Event listener for the login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Handle sign-up modal switching
    document.getElementById('signupLink').addEventListener('click', function (event) {
        event.preventDefault();
        loginModal.hide();
        signupModal.show();
    });

    // login modal switching from sign-up modal
    document.getElementById('loginLink').addEventListener('click', function (event) {
        event.preventDefault();
        signupModal.hide();
        loginModal.show();
    });

    // "Get Started Now" button
    getStartedNowButton.addEventListener('click', function() {
        if (isLoggedIn) {
            window.location.href = '../pages/dashboard.html'; // Go to dashboard if logged in
        } else {
            loginModal.show(); // Show login modal if not logged in
        }
    });
});
