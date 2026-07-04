// ==========================================
// Kalyana Varan - Login Page
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // Password Show / Hide
    // ==========================================

    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (password && togglePassword) {

        togglePassword.addEventListener("click", function () {

            const icon = this.querySelector("i");

            if (password.type === "password") {

                password.type = "text";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

            } else {

                password.type = "password";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

            }

        });

    }

    // ==========================================
    // Login Form Submission
    // ==========================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const email = document.getElementById("loginEmail");
            const passwordField = document.getElementById("password");

            if (email.value.trim() === "") {

                alert("Please enter your email address.");

                email.focus();

                return;

            }

            if (!validateEmail(email.value.trim())) {

                alert("Please enter a valid email address.");

                email.focus();

                return;

            }

            if (passwordField.value.trim() === "") {

                alert("Please enter your password.");

                passwordField.focus();

                return;

            }

            // Loading State
            const btn = document.querySelector(".login-btn");

            btn.disabled = true;

            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging In...';

            // ── Backend API Call ──
            KV.api.post('php/auth/login.php', {
                email: email.value.trim(),
                password: passwordField.value
            }).then(function (res) {
                if (res.success) {
                    window.location.href = "dashboard.html";
                } else {
                    btn.disabled = false;
                    btn.innerHTML = "Login";
                }
            });

        });

    }

    // ==========================================
    // Email Validation Function
    // ==========================================

    function validateEmail(email) {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(email);

    }

});