import { useEffect, useState } from "react";
import axios from "axios";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch Todos on Initial Load
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get("http://localhost:4321/api/todos");
      setTodos(response.data.todos);
    };

    fetchTodos();
  }, []);

  // Create
  const handleAddTodo = async () => {
    if (!newTitle.trim()) return;
    const response = await axios.post("http://localhost:4321/api/todos", {
      title: newTitle,
      description: newDescription,
    });

    setTodos((prevTodos) => [...prevTodos, response.data]);
    setNewTitle("");
    setNewDescription("");
  };

  // Toggle Completion
  const handleToggleTodo = async (id) => {
    try {
      await axios.patch(`http://localhost:4321/api/todos/${id}`, null);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling the todo:", error);
    }
  };

  // Update
  const handleUpdateTodo = async () => {
    try {
      if (!editId) return;

      await axios.put(`http://localhost:4321/api/todos/${editId}`, {
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

  // Delete
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4321/api/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting the todo:", error);
    }
  };

  return (
    <div>
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description"
        />
        <button onClick={editId ? handleUpdateTodo : handleAddTodo}>
          {editId ? "Update Task" : "Add Task"}
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>
              {todo.title} - {todo.description}
            </span>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <button
              onClick={() => {
                setEditId(todo.id);
                setNewTitle(todo.title);
                setNewDescription(todo.description);
              }}
            >
              Edit
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
