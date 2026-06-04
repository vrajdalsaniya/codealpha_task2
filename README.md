# CodeAlpha Task 2 - Proxima Project Management System

## Overview

Proxima is a full-stack Project Management System built using Node.js, Express.js, MongoDB, HTML, CSS, and JavaScript. It enables users to create projects, manage tasks, collaborate through comments, and monitor project progress efficiently.

---

## Features

- **User Authentication:** Secure registration and login functionality.
- **Project Management:** Create, update, delete, and manage projects.
- **Task Management:** Assign, update, and track project tasks.
- **Comment System:** Team collaboration through project comments.
- **Responsive Design:** Works across desktop and mobile devices.
- **RESTful API:** Backend APIs for project and task management.

---

## Tech Stack

### Backend

- **Node.js & Express.js:** Server-side application framework.
- **MongoDB & Mongoose:** Database and ODM.
- **JWT (jsonwebtoken):** Secure authentication.
- **bcryptjs:** Password hashing and verification.

### Frontend

- **HTML5 & CSS3:** User interface design.
- **Vanilla JavaScript:** Dynamic functionality and API integration.

---

## Project Structure

```text
project-management/
│
├── config/          # Database configuration
├── controllers/     # Request handling logic
├── middleware/      # Custom middleware
├── models/          # MongoDB schemas
├── public/          # Static frontend files
│   ├── css/
│   ├── js/
│   └── index.html
├── routes/          # Express routes
├── .env             # Environment variables
├── package.json
├── package-lock.json
├── server.js        # Main server file
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed locally or MongoDB Atlas account

### Installation

1. Clone the repository

```bash
git clone https://github.com/vrajdalsaniya/codealpha_task2.git
```

2. Navigate to project directory

```bash
cd codealpha_task2
```

3. Install dependencies

```bash
npm install
```

---

## Configuration

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/projectmanagement
JWT_SECRET=my_secret_jwt_key
NODE_ENV=development
```

---

## Running the Application

Start the server:

```bash
npm start
```

or

```bash
node server.js
```

The application will run at:

```text
http://localhost:5000
```

---

## API Features

- Authentication (Register/Login)
- Project Management
- Task Management
- Comment Management
- User Authorization

---

## Author

**Vraj Dalsaniya**

---

## License

This project is developed for the **CodeAlpha Full Stack Development Internship Program**.