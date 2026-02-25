import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const techStack = [
  { name: "React", desc: "Frontend UI" },
  { name: "AWS Lambda", desc: "Serverless compute" },
  { name: "DynamoDB", desc: "NoSQL database" },
  { name: "API Gateway", desc: "REST API layer" },
  { name: "Cognito", desc: "Authentication" },
  { name: "S3", desc: "Static hosting" },
  { name: "SQS", desc: "Message queue" },
  { name: "Terraform", desc: "Infrastructure as code" }
];

const AboutPage = () => {
  return (
    <Content>
      <div className="page-container">
        <div className="about-hero">
          <h1>AI-athon 2026</h1>
          <p>
            A serverless to-do application built on AWS, deployed with Terraform.
            This project serves as the error-generating workload for our
            AI-driven Incident Triage Assistant — Error Forensics.
          </p>
        </div>

        <div className="section-title">Tech Stack</div>
        <div className="tech-grid">
          {techStack.map(item => (
            <div className="tech-card" key={item.name}>
              <h4>{item.name}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Content>
  );
};

export default AboutPage;
