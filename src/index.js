import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import * as Sentry from "@sentry/react";
import { Amplify } from "aws-amplify";
import config from "../src/conf/config";

if (config.sentry.DSN) {
  Sentry.init({
    dsn: config.sentry.DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || "development",
    beforeSend(event) {
      event.tags = event.tags || {};
      event.tags.app = "insureflow";
      return event;
    }
  });
}

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "todos",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
