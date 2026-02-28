import React, { useEffect, useState } from "react";
import { Layout, Button, Spin, Input, PageHeader, Select } from "antd";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import CommentsList from "../components/CommentsList";
import { apiGet, apiPut } from "../utils/api";

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

const EditTodoPage = ({ location, history }) => {
  const initialFormState = { name: "", description: "" };
  const [formState, setFormState] = useState(initialFormState);
  const initialClaimState = { name: "", description: "" };
  const [claim, setClaim] = useState(initialClaimState);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  const claimId = location.pathname.split("/")[2];

  async function fetchClaim() {
    try {
      const res = await apiGet(`/todos/${claimId}`, "view_claim_details");
      const item = res.Item;
      setClaim({ name: item.name.S, description: item.description.S });
      setLoadingComplete(true);
    } catch (err) {
      console.log("error fetching claim:", err);
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

  async function updateClaim() {
    try {
      if (!formState.name || !formState.description) return;
      await apiPut(`/todos/${claimId}`, formState, "update_claim");
      history.push("/");
    } catch (err) {
      console.log("error updating claim:", err);
    }
  }

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  useEffect(() => {
    fetchCurrentUsername();
    fetchClaim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (claim.name) {
      setFormState({ name: claim.name, description: claim.description });
    }
  }, [claim]);

  return (
    <Content>
      <div className="page-container">
        <PageHeader
          className="site-page-header"
          title="Claim Details"
          style={{ marginBottom: 24 }}
        />

        {loadingComplete ? (
          <div>
            <div className="edit-current">
              <span className="claim-status" style={{ float: "right" }}>Open</span>
              <h3>{claim.name}</h3>
              <p>{claim.description}</p>
            </div>

            <div className="form-section">
              <div className="section-title" style={{ borderBottom: "none", marginBottom: 8, paddingBottom: 0, fontSize: 16 }}>
                Update Claim
              </div>
              <div style={{ marginBottom: 12 }}>
                <Select
                  value={formState.name || undefined}
                  placeholder="Claim Type"
                  onChange={value => setInput("name", value)}
                  style={{ width: "100%" }}
                  size="large"
                  dropdownStyle={{ background: "#21242f", borderColor: "#2e3140" }}
                >
                  {CLAIM_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Input
                  onChange={event =>
                    setInput("description", event.target.value)
                  }
                  value={formState.description}
                  placeholder="Updated claim details"
                />
              </div>
              <div className="card-actions">
                <Button onClick={updateClaim} type="primary">
                  Update Claim
                </Button>
                <Button>
                  <Link to="/">Back to Dashboard</Link>
                </Button>
              </div>
            </div>

            <CommentsList todoId={claimId} username={currentUsername} />
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
