const API_BASE_URL = "https://localhost:7071/api";

const userId = localStorage.getItem("userId");
const fullName = localStorage.getItem("fullName");
const todoList = document.getElementById("todoList");
const emptyState = document.getElementById("emptyState");
const messageBox = document.getElementById("message");

if (!userId) {
    window.location.href = "login.html";
}

document.getElementById("welcomeText").textContent = `Logged in as ${fullName || "User"}`;
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

function showMessage(text, type = "error") {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
}

function formatDate(value) {
    return new Date(value).toLocaleString();
}

function updateCounts(todos) {
    const completed = todos.filter(todo => todo.isCompleted).length;
    document.getElementById("totalCount").textContent = todos.length;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("pendingCount").textContent = todos.length - completed;
}

function renderTodos(todos) {
    todoList.innerHTML = "";
    emptyState.hidden = todos.length !== 0;
    updateCounts(todos);

    todos.forEach(todo => {
        const card = document.createElement("article");
        card.className = `todo-card ${todo.isCompleted ? "completed" : ""}`;

        card.innerHTML = `
            <div class="todo-card-header">
                <h2>${escapeHtml(todo.title)}</h2>
                <span class="status-pill">${todo.isCompleted ? "Completed" : "Pending"}</span>
            </div>
            <p>${escapeHtml(todo.description || "No description provided.")}</p>
            <small>Created: ${formatDate(todo.createdAt)}</small>
            <div class="card-actions">
                <a class="small-btn edit" href="add-edit.html?id=${todo.id}">Edit</a>
                <button class="small-btn toggle" type="button" data-action="toggle" data-id="${todo.id}">
                    ${todo.isCompleted ? "Mark Pending" : "Mark Complete"}
                </button>
                <button class="small-btn danger" type="button" data-action="delete" data-id="${todo.id}">Delete</button>
            </div>
        `;

        card.querySelector('[data-action="toggle"]').addEventListener("click", () => toggleStatus(todo));
        card.querySelector('[data-action="delete"]').addEventListener("click", () => deleteTodo(todo.id));
        todoList.appendChild(card);
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function loadTodos() {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/user/${userId}`);
        if (!response.ok) {
            showMessage("Unable to load todos.");
            return;
        }

        const todos = await response.json();
        showMessage("", "hidden");
        renderTodos(todos);
    } catch {
        showMessage("Could not connect to the backend API.");
    }
}

async function toggleStatus(todo) {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${todo.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: todo.title,
                description: todo.description,
                isCompleted: !todo.isCompleted,
                userId: Number(userId)
            })
        });

        if (!response.ok) {
            showMessage("Could not update task status.");
            return;
        }

        await loadTodos();
    } catch {
        showMessage("Could not connect to the backend API.");
    }
}

async function deleteTodo(id) {
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}?userId=${userId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            showMessage("Could not delete the task.");
            return;
        }

        await loadTodos();
    } catch {
        showMessage("Could not connect to the backend API.");
    }
}

loadTodos();
