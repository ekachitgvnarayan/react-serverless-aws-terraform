export function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";

  if (ua.indexOf("Firefox") > -1) {
    browser = "Firefox/" + (ua.match(/Firefox\/(\d+)/) || [])[1];
  } else if (ua.indexOf("Edg/") > -1) {
    browser = "Edge/" + (ua.match(/Edg\/(\d+)/) || [])[1];
  } else if (ua.indexOf("Chrome") > -1) {
    browser = "Chrome/" + (ua.match(/Chrome\/(\d+)/) || [])[1];
  } else if (ua.indexOf("Safari") > -1) {
    browser = "Safari/" + (ua.match(/Version\/(\d+)/) || [])[1];
  }

  let os = "Unknown";
  if (ua.indexOf("Win") > -1) os = "Windows";
  else if (ua.indexOf("Mac") > -1) os = "macOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iOS";

  return `${browser}, ${os}`;
}

export function getDeviceModel() {
  const ua = navigator.userAgent;

  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) {
    const match = ua.match(/Android.*;\s*(.*?)\s*Build/);
    return match ? match[1] : "Android Device";
  }
  if (/Macintosh/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  if (/Linux/.test(ua)) return "Linux PC";
  return "Unknown";
}
