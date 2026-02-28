const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const SERVICE_NAME = "UpdateClaim";

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

exports.handler = (event, context, callback) => {
  const claimId = event.path.split("/")[2];
  structuredLog("INFO", "Request received", event, { claimId });

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (parseErr) {
    structuredLog("ERROR", "Invalid JSON in request body", event, {
      claimId,
      error: { name: "ParseError", message: parseErr.message }
    });
    const response = {
      statusCode: 400,
      headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid JSON" })
    };
    return callback(null, response);
  }

  const params = {
    ExpressionAttributeNames: { "#N": "name", "#D": "description" },
    ExpressionAttributeValues: {
      ":n": { S: body.name },
      ":d": { S: body.description }
    },
    Key: { todoId: { S: claimId } },
    ReturnValues: "ALL_NEW",
    TableName: "todos",
    UpdateExpression: "SET #N = :n, #D = :d"
  };

  ddb.updateItem(params, function (err, data) {
    let responseCode = 200;
    let responseBody = "";

    if (err) {
      structuredLog("ERROR", "DynamoDB updateItem failed", event, {
        claimId,
        error: { name: err.code || "UnknownError", message: err.message }
      });
      responseCode = 500;
      responseBody = err;
    } else {
      structuredLog("INFO", "Claim updated successfully", event, { claimId });
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
