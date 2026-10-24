
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load saved tasks from the backend when the page opens
  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch(`${API_URL}/api/tasks`);

        if (!response.ok) {
          throw new Error('Could not load tasks.');
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(
          'Could not connect to the server. Make sure your backend is running.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  // Add a task and save it to the database
  async function addTask(event) {
    event.preventDefault();

    const title = newTask.trim();
    if (!title) return;

    setError('');

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Could not add task.');
      }

      const savedTask = await response.json();
      setTasks((currentTasks) => [savedTask, ...currentTasks]);
      setNewTask('');
    } catch (err) {
      setError('Could not save your task. Please try again.');
    }
  }

  // Update task completion in the database
  async function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    setError('');

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error('Could not update task.');
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id ? updatedTask : item
        )
      );
    } catch (err) {
      setError('Could not update the task. Please try again.');
    }
  }

  // Delete a task from the database
  async function deleteTask(id) {
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Could not delete task.');
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (err) {
      setError('Could not delete the task. Please try again.');
    }
  }

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const progress = tasks.length
    ? (completedCount / tasks.length) * 100
    : 0;

  return (
    <main className="app">
      <header className="header">
        <div className="logo">✓ FocusFlow</div>
        <span className="tag">MY WORKSPACE</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR PERSONAL TASK MANAGER</p>
        <h1>Make space for<br />what matters.</h1>
        <p className="subtitle">
          Small steps every day lead to big results.
        </p>
      </section>

      <section className="task-card">
        <div className="task-heading">
          <div>
            <h2>My tasks</h2>
            <p>
              {completedCount} of {tasks.length} completed
            </p>
          </div>
          <span className="task-count">{tasks.length}</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to get done?"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            + Add task
          </button>
        </form>

        {error && (
          <p role="alert" style={{ color: 'crimson' }}>
            {error}
          </p>
        )}

        <div className="task-list">
          {loading ? (
            <p className="empty-state">Loading your tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">
              No tasks yet. Add one to get started!
            </p>
          ) : (
            tasks.map((task) => (
              <div className="task-row" key={task.id}>
                <button
                  type="button"
                  className={`check ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  aria-label="Toggle task completion"
                >
                  {task.completed ? '✓' : ''}
                </button>

                <span
                  className={
                    task.completed
                      ? 'task-title completed'
                      : 'task-title'
                  }
                >
                  {task.title}
                </span>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <footer className="card-footer">
          <span>One step at a time.</span>
          <span>KEEP GOING ↗</span>
        </footer>
      </section>

      <footer className="page-footer">
        BUILT BY YOU · POWERED BY PROGRESS
      </footer>
    </main>
  );
}

export default App;
