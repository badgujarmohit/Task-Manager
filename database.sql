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

-- Updated Status Check to include 'forwarded'
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

-- Seed Data
INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
INSERT INTO users (username, password, role) VALUES ('user1', 'user123', 'user');
INSERT INTO users (username, password, role) VALUES ('user2', 'user123', 'user');