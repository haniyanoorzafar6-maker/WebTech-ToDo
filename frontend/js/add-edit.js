const API_BASE_URL = "https://localhost:7071/api";

const userId = localStorage.getItem("userId");
const params = new URLSearchParams(window.location.search);
const todoId = params.get("id");
const form = document.getElementById("todoForm");
const messageBox = document.getElementById("message");

if (!userId) {
    window.location.href = "login.html";
}

function showMessage(text, type = "error") {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
}

async function loadTodoForEdit() {
    if (!todoId) return;

    document.getElementById("pageTitle").textContent = "Edit Todo";

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${todoId}?userId=${userId}`);
        const todo = await response.json().catch(() => ({}));

        if (!response.ok) {
            showMessage(todo.message || "Todo item was not found.");
            return;
        }

        document.getElementById("title").value = todo.title;
        document.getElementById("description").value = todo.description || "";
        document.getElementById("isCompleted").checked = todo.isCompleted;
    } catch {
        showMessage("Could not connect to the backend API.");
    }
}

async function saveTodo(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const isCompleted = document.getElementById("isCompleted").checked;

    if (!title) {
        showMessage("Title is required.");
        return;
    }

    const payload = {
        title,
        description,
        isCompleted,
        userId: Number(userId)
    };

    const url = todoId ? `${API_BASE_URL}/todos/${todoId}` : `${API_BASE_URL}/todos`;
    const method = todoId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            showMessage(data.message || "Could not save todo.");
            return;
        }

        window.location.href = "index.html";
    } catch {
        showMessage("Could not connect to the backend API.");
    }
}

form.addEventListener("submit", saveTodo);
loadTodoForEdit();
