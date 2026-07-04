// ==========================================
// Kalyana Varan Matrimony
// Register Page
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registerForm");

    const fullName = document.getElementById("fullname");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const gender = document.getElementById("gender");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    // =====================================
    // Password Strength
    // =====================================

    password.addEventListener("input", function () {

        const strengthBar = document.querySelector(".password-strength span");
        const strengthText = document.querySelector(".password-text");

        if (!strengthBar || !strengthText) return;

        strengthBar.className = "";

        if (this.value.length < 6) {

            strengthBar.classList.add("strength-weak");
            strengthText.innerHTML = "Weak Password";

        }

        else if (this.value.length < 10) {

            strengthBar.classList.add("strength-medium");
            strengthText.innerHTML = "Medium Password";

        }

        else {

            strengthBar.classList.add("strength-strong");
            strengthText.innerHTML = "Strong Password";

        }

    });

    // =====================================
    // Form Validation & Submission
    // =====================================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        if (fullName.value.trim() === "") {

            alert("Please enter your full name.");
            fullName.focus();
            return;

        }

        if (!validateEmail(email.value)) {

            alert("Please enter a valid email address.");
            email.focus();
            return;

        }

        if (!validateMobile(mobile.value)) {

            alert("Enter a valid 10-digit mobile number.");
            mobile.focus();
            return;

        }

        if (gender.value === "") {

            alert("Please select your gender.");
            gender.focus();
            return;

        }

        if (password.value.length < 6) {

            alert("Password must contain at least 6 characters.");
            password.focus();
            return;

        }

        if (password.value !== confirmPassword.value) {

            alert("Passwords do not match.");
            confirmPassword.focus();
            return;

        }

        if (!terms.checked) {

            alert("Please accept the Terms & Conditions.");
            return;

        }

        // Loading Button

        const btn = document.querySelector(".login-btn");

        btn.disabled = true;

        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';

        // ── Backend API Call ──
        KV.api.post('php/auth/register.php', {
            fullname: fullName.value.trim(),
            email: email.value.trim(),
            mobile: mobile.value.trim(),
            gender: gender.value,
            password: password.value
        }).then(function (res) {
            if (res.success) {
                window.location.href = "complete-profile.html";
            } else {
                btn.disabled = false;
                btn.innerHTML = "Create Free Account";
            }
        });

    });

});

// =====================================
// Email Validation
// =====================================

function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

// =====================================
// Mobile Validation
// =====================================

function validateMobile(number) {

    return /^[6-9]\d{9}$/.test(number);

}