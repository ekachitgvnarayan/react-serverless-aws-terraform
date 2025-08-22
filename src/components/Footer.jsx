import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;

const AppFooter = () => (
  <Footer style={{ textAlign: "center" }}>Matthew Lau ©{new Date().toLocaleDateString()}</Footer>
);

export default AppFooter;
