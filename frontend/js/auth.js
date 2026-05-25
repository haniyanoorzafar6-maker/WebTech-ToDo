const API_BASE_URL = "https://localhost:7071/api";

const messageBox = document.getElementById("message");

function showMessage(text, type = "error") {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!fullName || !email || !password || !confirmPassword) {
        showMessage("Please fill in all fields.");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Password and confirm password must match.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            showMessage(data.message || "Registration failed.");
            return;
        }

        showMessage("Registration successful. Redirecting to login...", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 900);
    } catch {
        showMessage("Could not connect to the backend API.");
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showMessage("Please enter email and password.");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            showMessage(data.message || "Login failed.");
            return;
        }

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("email", data.email);
        window.location.href = "index.html";
    } catch {
        showMessage("Could not connect to the backend API.");
    }
}

document.getElementById("registerForm")?.addEventListener("submit", handleRegister);
document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
