import React, { useEffect, useState } from "react";
import { Layout, Button, Spin, Input, PageHeader } from "antd";
import { Link } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import CommentsList from "../components/CommentsList";

const { Content } = Layout;

const EditTodoPage = ({ location, history }) => {
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);
  const initialTodoState = { name: "", description: "" };
  const [todo, setTodo] = useState(initialTodoState);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currnetUsername, setCurrnetUsername] = useState("");

  const todoId = location.pathname.split("/")[2];

  async function fetchTodo() {
    try {
      const res = await API.get("todos", `/todos/${todoId}`);
      const item = res.Item;
      setTodo({ name: item.name.S, description: item.description.S });
      setLoadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching todo");
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

  async function editTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const config = {
        body: formState,
        headers: { "Content-Type": "application/json" }
      };
      await API.put("todos", `/todos/${todoId}`, config);
      history.push("/");
    } catch (err) {
      console.log("error updating todo:", err);
    }
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  useEffect(() => {
    fetchCurrnetUsername();
    fetchTodo();
  }, []);

  useEffect(() => {
    if (todo.name) {
      setFormState({ name: todo.name, description: todo.description });
    }
  }, [todo]);

  return (
    <Content>
      <div className="page-container">
        <PageHeader
          className="site-page-header"
          title="Edit Task"
          style={{ marginBottom: 24 }}
        />

        {loadingComplete ? (
          <div>
            <div className="edit-current">
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>
            </div>

            <div className="form-section">
              <div style={{ marginBottom: 12 }}>
                <Input
                  onChange={event => setInput("name", event.target.value)}
                  value={formState.name}
                  placeholder="Task name"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <Input
                  onChange={event =>
                    setInput("description", event.target.value)
                  }
                  value={formState.description}
                  placeholder="Description"
                />
              </div>
              <div className="card-actions">
                <Button onClick={editTodo} type="primary">
                  Save Changes
                </Button>
                <Button>
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>

            <CommentsList todoId={todoId} username={currnetUsername} />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
          </div>
        )}
      </div>
    </Content>
  );
};

export default EditTodoPage;
