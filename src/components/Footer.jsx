import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;

const AppFooter = () => (
  <Footer style={{ textAlign: "center" }}>
    InsureFlow &mdash; AI-powered Claims Management &copy; {new Date().getFullYear()}
  </Footer>
);

export default AppFooter;
