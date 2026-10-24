
import { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Build my first website', completed: false },
  ]);

  const [newTask, setNewTask] = useState('');

  function addTask(event) {
    event.preventDefault();

    if (newTask.trim() === '') return;

    const task = {
      id: Date.now(),
      title: newTask.trim(),
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask('');
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

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
              {tasks.filter((task) => task.completed).length}
              {' of '}
              {tasks.length} completed
            </p>
          </div>
          <span className="task-count">{tasks.length}</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${
                tasks.length
                  ? (tasks.filter((task) => task.completed).length /
                      tasks.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to get done?"
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
          />
          <button type="submit">+ Add task</button>
        </form>

        <div className="task-list">
          {tasks.length === 0 ? (
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
                    task.completed ? 'task-title completed' : 'task-title'
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
