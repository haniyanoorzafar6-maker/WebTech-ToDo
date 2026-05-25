# Web Technologies Database Connectivity Assignment

## Simple To-Do List with User Login

This is a complete ASP.NET Core Web API and HTML/CSS/JavaScript web application. Users can register, login, and manage their own to-do records stored in a SQL Server database named `WebTechTodoDb`.

## Features

- Simple user registration and login
- Passwords stored as hashes
- Each user only sees their own tasks
- Add, view, edit, complete/pending, and delete to-do items
- REST API endpoints using ASP.NET Core Web API
- SQL Server database access using Entity Framework Core
- Frontend validation before form submission
- Responsive, clean assignment-friendly UI

## Technologies Used

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- HTML
- CSS
- JavaScript Fetch API

## Project Structure

```text
D:\WebTech-ToDoList
|
├── backend
│   ├── Controllers
│   ├── Models
│   ├── Data
│   ├── DTOs
│   ├── Services
│   ├── Migrations
│   ├── Program.cs
│   └── appsettings.json
|
├── frontend
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── add-edit.html
│   ├── css
│   │   └── style.css
│   └── js
│       ├── auth.js
│       ├── todos.js
│       └── add-edit.js
|
└── README.md
```

## Database Setup

The default connection string is in `backend\appsettings.json`:

```json
"DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=WebTechTodoDb;Trusted_Connection=True;TrustServerCertificate=True;"
```

If you use SQL Server Express or another SQL Server instance, update the server name in the connection string before running migrations.

Required NuGet packages are already included in `backend\WebTechTodoList.csproj`:

- `Microsoft.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.Tools`
- `Swashbuckle.AspNetCore`

Run this command from the backend folder to create the database:

```powershell
dotnet ef database update
```

If `dotnet ef` is not installed, install it first:

```powershell
dotnet tool install --global dotnet-ef
```

## How To Run Backend

Open PowerShell and run:

```powershell
cd D:\WebTech-ToDoList\backend
dotnet restore
dotnet ef database update
dotnet run --launch-profile https
```

The API will run at:

```text
https://localhost:7071
```

Swagger will be available at:

```text
https://localhost:7071/swagger
```

## How To Run Frontend

After the backend is running, open this file in your browser:

```text
D:\WebTech-ToDoList\frontend\login.html
```

Start by registering a new user, then login and manage your to-do list.

If you change the backend URL or port, update `API_BASE_URL` at the top of these files:

- `frontend\js\auth.js`
- `frontend\js\todos.js`
- `frontend\js\add-edit.js`

## API Endpoints

### Auth

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and return user information |

### Todos

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/todos/user/{userId}` | Get all todos for one user |
| GET | `/api/todos/{id}?userId={userId}` | Get one todo by id |
| POST | `/api/todos` | Add a new todo |
| PUT | `/api/todos/{id}` | Update an existing todo |
| DELETE | `/api/todos/{id}?userId={userId}` | Delete a todo |

## Screenshots

Add screenshots here before submission:

- Login page screenshot
- Register page screenshot
- Main to-do list page screenshot
- Add/Edit todo page screenshot
- SQL Server database table screenshot
- Swagger/API test screenshot

## Submission Note

GitHub repository creation and upload are not included in this project. Submit or upload the project manually as required by your assignment instructions.
