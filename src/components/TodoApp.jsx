import { useEffect, useState } from "react";
import axios from "axios";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get("/api/todos.json");
      setTodos(response.data.todos);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!newTitle.trim()) return;
    const response = await axios.post("/api/todos.json", {
      title: newTitle,
      description: newDescription,
    });
    setTodos((prevTodos) => [...prevTodos, response.data]);
    setNewTitle("");
    setNewDescription("");
  };

  const handleToggleTodo = async (id) => {
    try {
      await axios.patch(`/api/todos/${id}.json`, null);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling the todo:", error);
    }
  };

  const handleUpdateTodo = async () => {
    try {
      if (!editId) return;

      await axios.put(`/api/todos/${editId}.json`, {
        title: newTitle,
        description: newDescription,
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editId
            ? { ...todo, title: newTitle, description: newDescription }
            : todo
        )
      );

      setEditId(null);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error updating the todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}.json`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting the todo:", error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-gray-900 font-sans">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 animate-fadeIn">Todo Application</h1>
      <div className="flex flex-col items-center gap-8 mb-12">
        <div className="w-full max-w-lg flex flex-col gap-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task Title"
            className="px-4 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out shadow-sm animate-slideInLeft"
          />
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Task Description"
            className="px-4 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out shadow-sm animate-slideInRight"
          />
        </div>
        <button
          onClick={editId ? handleUpdateTodo : handleAddTodo}
          className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-md hover:bg-gray-900 transition duration-300 ease-in-out transform hover:scale-105 animate-bounceIn"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>
      <ul className="space-y-6 max-w-2xl mx-auto">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`p-6 rounded-lg shadow-md border border-gray-200 flex justify-between items-center gap-4 bg-white transition duration-300 ease-in-out transform hover:scale-105 animate-fadeIn $ {
              todo.completed ? "opacity-70" : "opacity-100"
            } hover:shadow-lg`}
          >
            <div>
              <h2
                className={`font-semibold text-lg ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {todo.title}
              </h2>
              <p className={`mt-1 ${
                  todo.completed ? "text-gray-400" : "text-gray-600 "
                }`}>
                {todo.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="h-5 w-5 text-gray-800 rounded focus:ring-gray-400"
              />
              <button
                onClick={() => {
                  setEditId(todo.id);
                  setNewTitle(todo.title);
                  setNewDescription(todo.description);
                }}
                className="text-sm px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition duration-300 transform hover:scale-110"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-sm px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-110"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
