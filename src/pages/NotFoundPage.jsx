import React from "react";
import { Layout, Button } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const NotFoundPage = () => {
  return (
    <Content>
      <div className="page-container">
        <div className="not-found">
          <h1>404</h1>
          <h2>Page not found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div style={{ marginTop: 24 }}>
            <Button type="primary">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default NotFoundPage;
