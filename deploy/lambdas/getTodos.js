const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const SERVICE_NAME = "GetClaims";

function structuredLog(level, message, event, extra = {}) {
  const headers = (event && event.headers) || {};
  const log = {
    timestamp: new Date().toISOString(),
    level: level,
    service: SERVICE_NAME,
    correlation_id: headers["X-Correlation-ID"] || headers["x-correlation-id"] || "none",
    browser_os: headers["X-Browser-Info"] || headers["x-browser-info"] || "unknown",
    device_model: headers["X-Device-Model"] || headers["x-device-model"] || "unknown",
    user_action: headers["X-User-Action"] || headers["x-user-action"] || "unknown",
    request_id: (event && event.requestContext && event.requestContext.requestId) || "unknown",
    message: message,
    ...extra
  };
  console.log(JSON.stringify(log));
}

exports.handler = function (event, context, callback) {
  structuredLog("INFO", "Request received", event);

  const params = { TableName: "todos" };

  ddb.scan(params, function (err, data) {
    let responseCode = 200;
    let responseBody = "";

    if (err) {
      structuredLog("ERROR", "DynamoDB scan failed", event, {
        error: { name: err.code || "UnknownError", message: err.message }
      });
      responseCode = 500;
      responseBody = err;
    } else {
      structuredLog("INFO", "Claims retrieved successfully", event, { count: data.Count });
      responseBody = data;
    }

    const response = {
      statusCode: responseCode,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(responseBody)
    };
    callback(null, response);
  });
};
