"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("todo");
  const [searchQuery, setSearchQuery] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Create new task
  const addTask = () => {
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        title: inputValue,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputValue("");
    }
  };

  // Update task
  const updateTask = (id, newTitle) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
    setEditingId(null);
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle task completion
  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter tasks based on tab and search
  const filteredTasks = tasks.filter((task) => {
    const matchesTab =
      activeTab === "todo" ? !task.completed : task.completed;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <main className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            📝 My To-Do List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay organized and track your tasks
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search tasks..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("todo")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "todo"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            To Do ({tasks.filter((t) => !t.completed).length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "completed"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            Completed ({tasks.filter((t) => t.completed).length})
          </button>
        </div>

        {/* Tasks List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {searchQuery
                ? "No tasks match your search."
                : activeTab === "todo"
                ? "No tasks yet. Add one to get started!"
                : "No completed tasks yet."}
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 text-blue-500 rounded cursor-pointer"
                  />
                  {editingId === task.id ? (
                    <input
                      type="text"
                      defaultValue={task.title}
                      autoFocus
                      onBlur={(e) => updateTask(task.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          updateTask(task.id, e.target.value);
                        }
                      }}
                      className="flex-1 px-3 py-1 border border-blue-500 rounded dark:bg-slate-600 dark:text-white focus:outline-none"
                    />
                  ) : (
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                  )}
                  <button
                    onClick={() => setEditingId(task.id)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
