import { API } from "aws-amplify";
import * as Sentry from "@sentry/react";
import { generateCorrelationId } from "./correlationId";
import { getBrowserInfo, getDeviceModel } from "./deviceInfo";

function buildHeaders(userAction, extraHeaders = {}) {
  const correlationId = generateCorrelationId();

  Sentry.setTag("correlation_id", correlationId);
  Sentry.addBreadcrumb({
    category: "api",
    message: `${userAction} [${correlationId}]`,
    level: "info"
  });

  return {
    "Content-Type": "application/json",
    "X-Correlation-ID": correlationId,
    "X-User-Action": userAction || "unknown",
    "X-Browser-Info": getBrowserInfo(),
    "X-Device-Model": getDeviceModel(),
    ...extraHeaders
  };
}

const API_NAME = "todos";

export async function apiGet(path, userAction) {
  const headers = buildHeaders(userAction);
  return API.get(API_NAME, path, { headers });
}

export async function apiPost(path, body, userAction) {
  const headers = buildHeaders(userAction);
  return API.post(API_NAME, path, { body, headers });
}

export async function apiPut(path, body, userAction) {
  const headers = buildHeaders(userAction);
  return API.put(API_NAME, path, { body, headers });
}

export async function apiDelete(path, userAction) {
  const headers = buildHeaders(userAction);
  return API.del(API_NAME, path, { headers });
}
