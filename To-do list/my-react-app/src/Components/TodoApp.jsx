import React, { useState, useEffect } from 'react';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const STORAGE_KEY = 'todoTasks';
  const THEME_KEY = 'todoTheme';

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Load and apply theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const isDark = savedTheme ? JSON.parse(savedTheme) : false;
    setDarkMode(isDark);
    applyTheme(isDark);
  }, []);

  // Apply theme to document
  const applyTheme = (isDark) => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (isDark) {
      htmlElement.style.colorScheme = 'dark';
      htmlElement.setAttribute('data-theme', 'dark');
      bodyElement.style.colorScheme = 'dark';
      bodyElement.style.backgroundColor = '#0a0a0a';
    } else {
      htmlElement.style.colorScheme = 'light';
      htmlElement.setAttribute('data-theme', 'light');
      bodyElement.style.colorScheme = 'light';
      bodyElement.style.backgroundColor = '#ffffff';
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem(THEME_KEY, JSON.stringify(newDarkMode));
    applyTheme(newDarkMode);
  };

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // CREATE - Add a new task
  const addTask = (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleTimeString()
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  // UPDATE - Toggle task completion status
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // DELETE - Remove a task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Clear all completed tasks
  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  // Dynamic Theme Colors (Falling back if CSS variables aren't set globally)
  const colors = {
    bg: darkMode ? '#0a0a0a' : '#ffffff',
    bgSecondary: darkMode ? '#1a1a1a' : '#f5f5f5',
    text: darkMode ? '#e8e8e8' : '#1a1a1a',
    textSecondary: darkMode ? '#a0a0a0' : '#666666',
    border: darkMode ? '#2d2d2d' : '#e0e0e0',
    buttonBg: darkMode ? '#222222' : '#f0f0f0',
    removeBtn: darkMode ? '#ff5252' : '#d32f2f'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.bg,
      color: colors.text,
      transition: 'background-color 0.3s ease, color 0.3s ease',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>Tasks</h1>
            <button
              onClick={toggleDarkMode}
              style={{
                padding: '6px 12px',
                backgroundColor: colors.buttonBg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.2s'
              }}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: colors.textSecondary }}>
            {completedCount} of {totalCount} completed
          </p>
        </div>

        {/* Add Task Form */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask(e)}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.bg,
              color: colors.text,
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0070f3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            Add
          </button>
        </div>

        {/* Tasks List */}
        <div style={{
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: colors.bg
        }}>
          {tasks.length === 0 ? (
            <div style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              color: colors.textSecondary,
              backgroundColor: colors.bgSecondary
            }}>
              <p style={{ margin: 0, fontSize: '14px' }}>No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            <div>
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '1rem 1.25rem',
                    borderBottom: index !== tasks.length - 1 ? `1px solid ${colors.border}` : 'none',
                    backgroundColor: task.completed ? colors.bgSecondary : colors.bg,
                    transition: 'background-color 0.15s'
                  }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  />

                  {/* Task Text & Timestamp */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontSize: '16px',
                      color: task.completed ? colors.textSecondary : colors.text,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      wordBreak: 'break-word'
                    }}>
                      {task.text}
                    </p>
                    <p style={{
                      margin: '4px 0 0',
                      fontSize: '12px',
                      color: colors.textSecondary
                    }}>
                      {task.createdAt}
                    </p>
                  </div>

                  {/* --- NEW & VISIBLE REMOVE BUTTON --- */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: colors.removeBtn,
                      border: `1px solid ${colors.removeBtn}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.removeBtn;
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = colors.removeBtn;
                    }}
                  >
                    🗑️ Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {tasks.length > 0 && completedCount > 0 && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              onClick={clearCompleted}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`,
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              Clear {completedCount} completed
            </button>
          </div>
        )}

        {/* Info Box */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: colors.bgSecondary,
          borderRadius: '6px',
          fontSize: '13px',
          color: colors.textSecondary,
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 0.5rem', fontWeight: 500 }}>About this app:</p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>All tasks are saved to your browser's local storage</li>
            <li>Data persists even after closing the page</li>
            <li>This demonstrates CRUD operations (Create, Read, Update, Delete)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}