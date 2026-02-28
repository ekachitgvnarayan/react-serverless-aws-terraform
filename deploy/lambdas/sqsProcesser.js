const SERVICE_NAME = "ProcessQueueMessage";

function structuredLog(level, message, extra = {}) {
  const log = {
    timestamp: new Date().toISOString(),
    level: level,
    service: SERVICE_NAME,
    correlation_id: extra.correlation_id || "none",
    browser_os: "N/A",
    device_model: "N/A",
    user_action: "queue_processing",
    message: message,
    ...extra
  };
  console.log(JSON.stringify(log));
}

exports.handler = async function (event, context) {
  structuredLog("INFO", "SQS batch received", { recordCount: event.Records.length });

  event.Records.forEach((record, index) => {
    try {
      const body = JSON.parse(record.body);
      structuredLog("INFO", "Record processed", {
        recordIndex: index,
        correlation_id: body.correlation_id || "none",
        messageId: record.messageId
      });
    } catch (err) {
      structuredLog("ERROR", "Failed to parse SQS record", {
        recordIndex: index,
        messageId: record.messageId,
        error: { name: "ParseError", message: err.message }
      });
    }
  });

  return {};
};
