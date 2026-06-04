# Proxima - Project Management Tool

A full-stack, collaborative project management tool built with Node.js, Express, MongoDB, and Vanilla JavaScript. Proxima allows teams to create workspaces, track tasks through a Kanban-style board, and collaborate seamlessly in real-time.

## 🚀 Features

- **User Authentication**: Secure sign-up and login utilizing JSON Web Tokens (JWT) and bcrypt password hashing.
- **Project Workspaces**: Create individual projects to group your team's tasks.
- **Kanban Task Board**: Manage your tasks across three distinct statuses: `To Do`, `In Progress`, and `Done`.
- **Real-Time Updates**: Built with `Socket.io` to ensure tasks and comments are synced instantly across all active users in the workspace without page reloads.
- **Task Comments**: Keep communication centralized by leaving comments directly on specific tasks.
- **Premium UI**: A sleek, dark-mode single-page application (SPA) built with Vanilla HTML, CSS, and JS. No heavy frontend frameworks required.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+).
- **Backend Architecture**: Node.js, Express.js (MVC Pattern).
- **Database**: MongoDB with Mongoose ODM.
- **Real-time Communication**: Socket.io.
- **Security**: `bcryptjs` for encryption, `jsonwebtoken` for stateless authentication.

## 📁 Project Structure (MVC Architecture)

```
Project_Mangement_Tool/
│
├── config/
│   └── db.js                  # MongoDB Connection configuration
│
├── controllers/
│   ├── authController.js      # Handles user registration and login logic
│   ├── commentController.js   # Handles creating and retrieving comments
│   ├── projectController.js   # Handles project CRUD
│   └── taskController.js      # Handles task CRUD and Socket.io events
│
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
│
├── models/
│   ├── Comment.js             # Mongoose Schema for comments
│   ├── Project.js             # Mongoose Schema for projects
│   ├── Task.js                # Mongoose Schema for tasks
│   └── User.js                # Mongoose Schema for users
│
├── public/                    # Static frontend files (SPA)
│   ├── css/
│   │   └── style.css          # UI styles
│   ├── js/
│   │   ├── app.js             # Main frontend logic and API fetching
│   │   └── socket.js          # Socket.io client configuration
│   └── index.html             # Main entry point for the frontend
│
├── routes/
│   ├── authRoutes.js          # API endpoints for authentication
│   ├── commentRoutes.js       # API endpoints for comments
│   ├── projectRoutes.js       # API endpoints for projects
│   └── taskRoutes.js          # API endpoints for tasks
│
├── .env                       # Environment variables (Ignored in Git)
├── server.js                  # Main Express Server entry point
└── package.json               # Node.js dependencies and scripts
```

## ⚙️ Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/) installed on your machine.
- [MongoDB](https://www.mongodb.com/) installed locally or a remote MongoDB URI (e.g., MongoDB Atlas).

### Steps

1. **Clone the repository or navigate to the project directory:**
   ```bash
   cd Project_Mangement_Tool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create or edit the `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/project_management
   JWT_SECRET=your_super_secret_jwt_key
   ```
   *(Update the `MONGO_URI` if you are using an external MongoDB provider)*

4. **Start the Application:**
   ```bash
   npm start
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:5000` to start using the tool!

## 🧪 How to Verify Real-Time Features

1. Open the application in your browser (`http://localhost:5000`) and log in.
2. Open a second window using **Incognito/Private Mode** and log in with a different user account.
3. Open the same project in both windows side-by-side.
4. Add a task or leave a comment in the first window. You will see the update appear instantaneously in the second window without needing to refresh!

## 🤝 Author
Built as part of an internship project for CodeAlpha.
