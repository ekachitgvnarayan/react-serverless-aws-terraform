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
  { name: "Sentry", desc: "Error monitoring" },
  { name: "Terraform", desc: "Infrastructure as code" },
  { name: "CloudWatch", desc: "System logging" }
];

const AboutPage = () => {
  return (
    <Content>
      <div className="page-container">
        <div className="about-hero">
          <h1>InsureFlow</h1>
          <p>
            A serverless insurance claims management platform built on AWS,
            deployed with Terraform. InsureFlow powers the error-generating
            workload for our AI-driven Incident Triage Assistant &mdash;
            correlating CloudWatch system logs with Sentry application traces
            to deliver intelligent root cause analysis.
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
