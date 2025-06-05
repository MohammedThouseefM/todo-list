import React, { useState, useEffect } from "react";
import "./TodoApp.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    // Load todos from localStorage if they exist
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addTask = () => {
    if (task.trim() === "") return;
    const now = new Date();
    setTodos([
      ...todos,
      {
        text: task,
        completed: false,
        createdAt: now.toLocaleString(),
      },
    ]);
    setTask("");
  };

  const toggleComplete = (index) => {
    const updated = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  const deleteTask = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTodos([]);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(todos[index].text);
  };

  const saveEdit = (index) => {
    const updated = todos.map((todo, i) =>
      i === index ? { ...todo, text: editText } : todo
    );
    setTodos(updated);
    setEditingIndex(null);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "done" && todo.completed) ||
      (filterStatus === "notdone" && !todo.completed);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app-container">
      <h1 className="heading">My To-Do List</h1>

      <div className="clock">
        {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
      </div>

      {todos.length > 0 && (
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="input-section">
        <input
          type="text"
          placeholder="✍️ Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {todos.length > 0 && (
        <div className="filter-section">
          <button
            className={filterStatus === "all" ? "active-filter" : ""}
            onClick={() => setFilterStatus("all")}
          >
            All
          </button>
          <button
            className={filterStatus === "done" ? "active-filter" : ""}
            onClick={() => setFilterStatus("done")}
          >
            Done
          </button>
          <button
            className={filterStatus === "notdone" ? "active-filter" : ""}
            onClick={() => setFilterStatus("notdone")}
          >
            Not Done
          </button>
        </div>
      )}

      <ul className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo, index) => (
            <li key={index} className={todo.completed ? "completed" : ""}>
              <div className="todo-content">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                    onKeyPress={(e) => e.key === "Enter" && saveEdit(index)}
                  />
                ) : (
                  <span onClick={() => toggleComplete(index)}>
                    {todo.text}
                  </span>
                )}
                <div className="timestamp">Added: {todo.createdAt}</div>
              </div>
              <div className="action-buttons">
                {editingIndex === index ? (
                  <>
                    <button onClick={() => saveEdit(index)}>💾</button>
                    <button onClick={() => setEditingIndex(null)}>✖️</button>
                  </>
                ) : (
                  <button onClick={() => startEditing(index)}>✏️</button>
                )}
                <button onClick={() => deleteTask(index)}>❌</button>
              </div>
            </li>
          ))
        ) : (
          <li className="no-tasks">
            {todos.length === 0 ? "No tasks yet" : "No tasks found"}
          </li>
        )}
      </ul>

      {todos.length > 0 && (
        <button onClick={clearAll} className="clear-btn">
          Clear All Tasks
        </button>
      )}
    </div>
  );
}

export default App;