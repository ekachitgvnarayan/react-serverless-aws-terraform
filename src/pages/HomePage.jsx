import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "antd";
import { Card, Button, Input } from "antd";
import "antd/dist/antd.css";
import "../App.css";
import { Layout, Spin } from "antd";
import { API, Auth } from "aws-amplify";

const { Content } = Layout;

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currnetUsername, setCurrnetUsername] = useState("");
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    fetchCurrnetUsername();
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const res = await API.get("todos", "/todos");
      setTodos(res.Items);
      setLoadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log(err);
      console.log("error fetching todos");
    }
  }

  async function fetchCurrnetUsername() {
    try {
      const res = await Auth.currentUserInfo();
      setCurrnetUsername(res.username);
    } catch (err) {
      console.log(err);
      console.log("error fetching current username");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState, username: currnetUsername };
      setTodos([...todos, todo]);
      setFormState(initialFormState);

      const config = {
        body: todo,
        headers: {
          "Content-Type": "application/json"
        }
      };
      await API.post("todos", "/todos", config);
      fetchTodos();
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  async function removeTodo(id) {
    try {
      setTodos(todos.filter(todo => todo.todoId.S !== id));
      await API.del("todos", `/todos/${id}`);
    } catch (err) {
      console.log("error removing todo:", err);
    }
  }

  return (
    <Content>
      <div className="page-container">
        <PageHeader
          className="site-page-header"
          title={`Welcome, ${currnetUsername}`}
          subTitle="Manage your tasks with AWS serverless power"
          style={{ marginBottom: 24 }}
        />

        <div className="form-section">
          <div className="form-row">
            <Input
              onChange={event => setInput("name", event.target.value)}
              value={formState.name}
              placeholder="Task name"
              onPressEnter={addTodo}
            />
            <Input
              onChange={event => setInput("description", event.target.value)}
              value={formState.description}
              placeholder="Description"
              onPressEnter={addTodo}
            />
            <Button onClick={addTodo} type="primary">
              Add Task
            </Button>
          </div>
        </div>

        {loadingComplete ? (
          todos.length > 0 ? (
            <div className="todo-grid">
              {todos.map((todo, index) => (
                <Card
                  key={todo.todoId ? todo.todoId.S : index}
                  title={todo.name.S ? todo.name.S : todo.name}
                >
                  <p className="card-description">
                    {todo.description.S ? todo.description.S : todo.description}
                  </p>
                  {todo.username && (
                    <p className="card-meta">
                      by {todo.username.S ? todo.username.S : todo.username}
                    </p>
                  )}
                  <div className="card-actions">
                    {todo.todoId && todo.username.S === currnetUsername && (
                      <Button
                        className="btn-danger"
                        onClick={() => removeTodo(todo.todoId.S)}
                        size="small"
                      >
                        Done
                      </Button>
                    )}
                    {todo.todoId && (
                      <Button size="small">
                        <Link to={`/edit/${todo.todoId.S}`}>Details</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">
                No tasks yet. Add your first one above!
              </div>
            </div>
          )
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
          </div>
        )}
      </div>
    </Content>
  );
};

export default HomePage;
