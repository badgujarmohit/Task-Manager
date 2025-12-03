# 📝 Task Manager App (PERN Stack)

A full-stack Task Management application built with **PostgreSQL, Express, React, and Node.js**. The application features distinct Admin and User roles, a responsive UI, and a specific workflow for task assignment, cancellation, and reassignment.

## 🚀 Features

### 👑 Admin Role
*   **Project & Task Management:** Create new projects and add tasks with difficulty levels (Hard, Medium, Easy).
*   **Smart Sorting:** Tasks are automatically sorted by difficulty (Hard → Medium → Easy).
*   **Task Assignment:** Assign tasks to specific users.
*   **Status Tracking:** View tasks statuses: Active, Cancelled, Completed, and Forwarded.
*   **Cancellation Handling:** View reasons provided by users for cancelled tasks.
*   **Reassignment Workflow:** Specific UI to reassign cancelled tasks to new users (changes status to 'Forwarded').

### 👤 User Role
*   **Dashboard:** View only assigned tasks (sorted by difficulty).
*   **Task Completion:** Mark tasks as "Completed" (sends to Admin).
*   **Cancellation:** Cancel tasks via a modal popup, requiring a reason description.
*   **Responsive UI:** Mobile-friendly card layout and scrollable tables.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, React Router, Custom CSS (Responsive)
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **API:** RESTful API with Axios

---

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
*   **Node.js** installed on your machine.
*   **PostgreSQL** installed and running.

---

## 📥 Installation & Setup

### 1. Database Setup (PostgreSQL)
1.  Open your SQL Shell (psql) or pgAdmin.
2.  Run the following commands to create the schema and seed data:

```sql
CREATE DATABASE task_manager;

\c task_manager;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'user')) NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    difficulty VARCHAR(10) CHECK (difficulty IN ('Hard', 'Medium', 'Easy')),
    status VARCHAR(20) CHECK (status IN ('active', 'cancelled', 'completed', 'forwarded')) DEFAULT 'active',
    project_id INTEGER REFERENCES projects(id),
    assigned_to INTEGER REFERENCES users(id),
    cancel_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Users
INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
INSERT INTO users (username, password, role) VALUES ('user1', 'user123', 'user');
INSERT INTO users (username, password, role) VALUES ('user2', 'user123', 'user');
