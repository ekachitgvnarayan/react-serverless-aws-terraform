import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { apiGet, apiPost, apiDelete } from "../utils/api";

const Likes = ({ commentId, username }) => {
  const [approvals, setApprovals] = useState([]);

  const handleToggleApproval = commentId => {
    const userHasApproved =
      approvals.filter(a => a.username.S === username).length > 0;
    if (!userHasApproved) {
      addApproval(commentId);
    } else {
      removeApproval();
    }
  };

  const addApproval = async commentId => {
    try {
      await apiPost("/likes", { username, commentId }, "approve_note");
      fetchApprovals(commentId);
    } catch (err) {
      console.log("error creating approval:", err);
    }
  };

  async function removeApproval() {
    const approvalId = approvals.filter(a => a.username.S === username)[0]
      .likeId.S;
    try {
      setApprovals(approvals.filter(a => a.likeId.S !== approvalId));
      await apiDelete(`/likes/${approvalId}`, "revoke_approval");
      fetchApprovals(commentId);
    } catch (err) {
      console.log("error removing approval:", err);
    }
  }

  const fetchApprovals = async commentId => {
    try {
      const res = await apiGet(`/likes?commentId=${commentId}`, "load_approvals");
      setApprovals(res.Items);
    } catch (err) {
      console.log("error fetching approvals:", err);
    }
  };

  useEffect(() => {
    fetchApprovals(commentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Button
      icon={<CheckCircleOutlined />}
      onClick={() => handleToggleApproval(commentId)}
    >
      {approvals.length > 0 ? approvals.length : <div style={styles.placeholder}></div>}
    </Button>
  );
};

const styles = {
  placeholder: {
    width: "23px"
  }
};
export default Likes;
