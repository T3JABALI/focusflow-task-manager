
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Check that the backend is running
app.get('/', (req, res) => {
  res.json({ message: 'FocusFlow API is running!' });
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, completed, created_at FROM tasks ORDER BY id DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Could not fetch tasks:', error.message);
    res.status(500).json({ error: 'Could not fetch tasks' });
  }
});

// Add a task
app.post('/api/tasks', async (req, res) => {
  const title = req.body.title;

  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'A task title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, completed, created_at',
      [title.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Could not add task:', error.message);
    res.status(500).json({ error: 'Could not add task' });
  }
});

// Update task completion
app.patch('/api/tasks/:id', async (req, res) => {
  if (typeof req.body.completed !== 'boolean') {
    return res.status(400).json({ error: 'completed must be true or false' });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING id, title, completed, created_at',
      [req.body.completed, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Could not update task:', error.message);
    res.status(500).json({ error: 'Could not update task' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Could not delete task:', error.message);
    res.status(500).json({ error: 'Could not delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`FocusFlow API listening on port ${PORT}`);
});
