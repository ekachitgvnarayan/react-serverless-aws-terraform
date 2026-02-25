import React, { useEffect, useState } from "react";
import { Spin, Card, Input, Button } from "antd";
import { API } from "aws-amplify";
import Likes from "./Likes";

const CommentsList = ({ todoId, username }) => {
  const initialFormState = { content: "" };
  const [formState, setFormState] = useState(initialFormState);
  const [comments, setComments] = useState([]);
  const [loadingComplete, setloadingComplete] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchComments() {
    try {
      const res = await API.get("todos", `/comments?todoId=${todoId}`);
      setComments(res.Items);
      setloadingComplete({ loadingComplete: true });
    } catch (err) {
      console.log("error fetching comments");
    }
  }

  async function addComment() {
    try {
      if (!formState.content) return;
      const comment = { ...formState, todoId, username };
      setFormState(initialFormState);
      const config = {
        body: comment,
        headers: { "Content-Type": "application/json" }
      };
      await API.post("todos", "/comments", config);
      fetchComments();
    } catch (err) {
      console.log("error creating comment:", err);
    }
  }

  async function removeComment(id) {
    try {
      setComments(comments.filter(comment => comment.commentId.S !== id));
      await API.del("todos", `/comments/${id}`);
    } catch (err) {
      console.log("error removing comment:", err);
    }
  }

  return (
    <div>
      <div className="section-title">Comments</div>

      <div className="form-section">
        <div className="form-row">
          <Input
            onChange={event => setInput("content", event.target.value)}
            value={formState.content}
            placeholder="Write a comment..."
            onPressEnter={addComment}
          />
          <Button onClick={addComment} type="primary">
            Add
          </Button>
        </div>
      </div>

      {loadingComplete ? (
        comments.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {comments.map((comment, index) => (
              <Card
                key={comment.commentId ? comment.commentId.S : index}
                size="small"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: 0, color: "#e8e8ed", fontWeight: 500 }}>
                      {comment.content.S}
                    </p>
                    <p className="card-meta">{comment.username.S}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Likes commentId={comment.commentId.S} username={username} />
                    {comment.username.S === username && (
                      <Button
                        className="btn-danger"
                        size="small"
                        onClick={() => removeComment(comment.commentId.S)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: "32px 0" }}>
            <div className="empty-state-text">No comments yet.</div>
          </div>
        )
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default CommentsList;
