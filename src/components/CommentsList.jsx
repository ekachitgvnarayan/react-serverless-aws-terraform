import React, { useEffect, useState } from "react";
import { Spin, Card, Input, Button } from "antd";
import Likes from "./Likes";
import { apiGet, apiPost, apiDelete } from "../utils/api";

const CommentsList = ({ todoId, username }) => {
  const initialFormState = { content: "" };
  const [formState, setFormState] = useState(initialFormState);
  const [notes, setNotes] = useState([]);
  const [loadingComplete, setLoadingComplete] = useState(true);

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchNotes() {
    try {
      const res = await apiGet(`/comments?todoId=${todoId}`, "load_claim_notes");
      setNotes(res.Items);
      setLoadingComplete(true);
    } catch (err) {
      console.log("error fetching notes:", err);
    }
  }

  async function addNote() {
    try {
      if (!formState.content) return;
      const note = { ...formState, todoId, username };
      setFormState(initialFormState);
      await apiPost("/comments", note, "add_claim_note");
      fetchNotes();
    } catch (err) {
      console.log("error creating note:", err);
    }
  }

  async function removeNote(id) {
    try {
      setNotes(notes.filter(note => note.commentId.S !== id));
      await apiDelete(`/comments/${id}`, "delete_claim_note");
    } catch (err) {
      console.log("error removing note:", err);
    }
  }

  return (
    <div>
      <div className="section-title">Claim Notes</div>

      <div className="form-section">
        <div className="form-row">
          <Input
            onChange={event => setInput("content", event.target.value)}
            value={formState.content}
            placeholder="Add a note to this claim..."
            onPressEnter={addNote}
          />
          <Button onClick={addNote} type="primary">
            Add Note
          </Button>
        </div>
      </div>

      {loadingComplete ? (
        notes.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notes.map((note, index) => (
              <Card
                key={note.commentId ? note.commentId.S : index}
                size="small"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ margin: 0, color: "#e8e8ed", fontWeight: 500 }}>
                      {note.content.S}
                    </p>
                    <p className="card-meta">Agent: {note.username.S}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Likes commentId={note.commentId.S} username={username} />
                    {note.username.S === username && (
                      <Button
                        className="btn-danger"
                        size="small"
                        onClick={() => removeNote(note.commentId.S)}
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
            <div className="empty-state-text">No notes on this claim yet.</div>
          </div>
        )
      ) : (
        <Spin />
      )}
    </div>
  );
};

export default CommentsList;
