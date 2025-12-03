const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DATABASE CONFIGURATION
const pool = new Pool({
  user: 'postgres',       // Check your username
  host: 'localhost',
  database: 'task_manager',
  password: 'mohit',      // Check your password
  port: 5432,
});

const orderByDifficulty = `
  ORDER BY 
  CASE difficulty 
    WHEN 'Hard' THEN 1 
    WHEN 'Medium' THEN 2 
    WHEN 'Easy' THEN 3 
  END ASC
`;

// --- AUTH ---
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.json({ user: result.rows[0] });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) { res.status(500).json(err); }
});

app.get('/users', async (req, res) => {
  const result = await pool.query("SELECT id, username FROM users WHERE role = 'user'");
  res.json(result.rows);
});

// --- ADMIN ---
app.post('/projects', async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO projects (name) VALUES ($1)', [name]);
  res.json({ message: 'Project created' });
});

app.get('/projects', async (req, res) => {
  const result = await pool.query('SELECT * FROM projects');
  res.json(result.rows);
});

app.post('/tasks', async (req, res) => {
  const { title, difficulty, project_id } = req.body;
  await pool.query(
    'INSERT INTO tasks (title, difficulty, project_id, status) VALUES ($1, $2, $3, $4)', 
    [title, difficulty, project_id, 'active']
  );
  res.json({ message: 'Task created' });
});

app.get('/admin/tasks', async (req, res) => {
  const query = `
    SELECT t.*, u.username as assigned_user, p.name as project_name 
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    ${orderByDifficulty}
  `;
  const result = await pool.query(query);
  res.json(result.rows);
});

// REASSIGN TASK -> Sets Status to 'forwarded'
app.put('/tasks/:id/assign', async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  
  await pool.query(
    "UPDATE tasks SET assigned_to = $1, status = 'forwarded', cancel_reason = NULL WHERE id = $2", 
    [userId, id]
  );
  res.json({ message: 'Task forwarded to user' });
});

// --- USER ---
app.get('/user/:id/tasks', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT t.*, p.name as project_name 
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE assigned_to = $1
    ${orderByDifficulty}
  `;
  const result = await pool.query(query, [id]);
  res.json(result.rows);
});

// CANCEL TASK -> Status 'cancelled' with reason
app.put('/tasks/:id/cancel', async (req, res) => {
  const { reason } = req.body;
  const { id } = req.params;
  await pool.query(
    "UPDATE tasks SET status = 'cancelled', cancel_reason = $1 WHERE id = $2", 
    [reason, id]
  );
  res.json({ message: 'Task cancelled' });
});

// COMPLETE TASK -> Status 'completed'
app.put('/tasks/:id/complete', async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE tasks SET status = 'completed' WHERE id = $1", [id]);
  res.json({ message: 'Task completed' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});