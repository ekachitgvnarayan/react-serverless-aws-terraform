import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "antd";
import { Card, Button, Input, Select } from "antd";
import "antd/dist/antd.css";
import "../App.css";
import { Layout, Spin } from "antd";
import { Auth } from "aws-amplify";
import { apiGet, apiPost, apiDelete } from "../utils/api";

const { Content } = Layout;
const { Option } = Select;

const CLAIM_TYPES = [
  "Auto Collision",
  "Property Damage",
  "Health - Surgery",
  "Health - Emergency",
  "Life Insurance",
  "Travel Insurance",
  "Liability Claim",
  "Workers Compensation",
  "Home Insurance",
  "Other"
];

const HomePage = () => {
  const [claims, setClaims] = useState([]);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    fetchCurrentUsername();
    fetchClaims();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchClaims() {
    try {
      const res = await apiGet("/todos", "load_claims_dashboard");
      setClaims(res.Items);
      setLoadingComplete(true);
    } catch (err) {
      console.log("error fetching claims:", err);
    }
  }

  async function fetchCurrentUsername() {
    try {
      const res = await Auth.currentUserInfo();
      setCurrentUsername(res.username);
    } catch (err) {
      console.log("error fetching current username:", err);
    }
  }

  async function fileClaim() {
    try {
      if (!formState.name || !formState.description) return;
      const claim = { ...formState, username: currentUsername };
      setClaims([...claims, claim]);
      setFormState(initialFormState);
      await apiPost("/todos", claim, "submit_new_claim");
      fetchClaims();
    } catch (err) {
      console.log("error filing claim:", err);
    }
  }

  async function resolveClaim(id) {
    try {
      setClaims(claims.filter(c => c.todoId.S !== id));
      await apiDelete(`/todos/${id}`, "resolve_claim");
    } catch (err) {
      console.log("error resolving claim:", err);
    }
  }

  return (
    <Content>
      <div className="page-container">
        <PageHeader
          className="site-page-header"
          title={`Claims Dashboard`}
          subTitle={`Agent: ${currentUsername}`}
          style={{ marginBottom: 24 }}
        />

        <div className="form-section">
          <div className="section-title" style={{ borderBottom: "none", marginBottom: 8, paddingBottom: 0, fontSize: 16 }}>
            File New Claim
          </div>
          <div className="form-row">
            <Select
              value={formState.name || undefined}
              placeholder="Claim Type"
              onChange={value => setInput("name", value)}
              style={{ flex: 1 }}
              size="large"
              dropdownStyle={{ background: "#21242f", borderColor: "#2e3140" }}
            >
              {CLAIM_TYPES.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
            <Input
              onChange={event => setInput("description", event.target.value)}
              value={formState.description}
              placeholder="Claim details (e.g., incident date, location, damage)"
              onPressEnter={fileClaim}
            />
            <Button onClick={fileClaim} type="primary">
              File Claim
            </Button>
          </div>
        </div>

        {loadingComplete ? (
          claims.length > 0 ? (
            <div className="todo-grid">
              {claims.map((claim, index) => (
                <Card
                  key={claim.todoId ? claim.todoId.S : index}
                  title={claim.name.S ? claim.name.S : claim.name}
                  extra={
                    <span className="claim-status">Open</span>
                  }
                >
                  <p className="card-description">
                    {claim.description.S ? claim.description.S : claim.description}
                  </p>
                  {claim.username && (
                    <p className="card-meta">
                      Filed by: {claim.username.S ? claim.username.S : claim.username}
                    </p>
                  )}
                  <div className="card-actions">
                    {claim.todoId && claim.username.S === currentUsername && (
                      <Button
                        className="btn-danger"
                        onClick={() => resolveClaim(claim.todoId.S)}
                        size="small"
                      >
                        Resolve
                      </Button>
                    )}
                    {claim.todoId && (
                      <Button size="small">
                        <Link to={`/edit/${claim.todoId.S}`}>View Claim</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><span role="img" aria-label="clipboard">📋</span></div>
              <div className="empty-state-text">
                No claims filed yet. Submit your first claim above.
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
