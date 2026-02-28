import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as Sentry from "@sentry/react";
import HomePage from "../src/pages/HomePage";
import Routes from "./routers/Routes";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";

import { Layout } from "antd";
import { withAuthenticator } from "@aws-amplify/ui-react";

const SentryRoute = Sentry.withSentryRouting(Route);

const FallbackComponent = () => (
  <div style={{ textAlign: "center", padding: "80px 24px", color: "#e8e8ed" }}>
    <h2>Something went wrong</h2>
    <p style={{ color: "#9ca3af" }}>
      An unexpected error occurred. Our team has been notified.
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        marginTop: 16,
        padding: "10px 24px",
        background: "#6c63ff",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600
      }}
    >
      Reload Page
    </button>
  </div>
);

const App = () => (
  <Sentry.ErrorBoundary fallback={FallbackComponent} showDialog>
    <Router>
      <Fragment>
        <Layout className="layout" style={styles.layout}>
          <Navbar />
          <Switch>
            <SentryRoute exact path="/" component={HomePage} />
            <SentryRoute component={Routes} />
          </Switch>
          <Footer />
        </Layout>
      </Fragment>
    </Router>
  </Sentry.ErrorBoundary>
);

const styles = {
  layout: {
    minHeight: "100vh"
  }
};
export default withAuthenticator(App);
