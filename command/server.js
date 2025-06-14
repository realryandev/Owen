const os = require("os");
const fetch = require("node-fetch");
const prettyMs = require("pretty-ms").default || require("pretty-ms");
require("../settings/config");

let handler = async (m, { sender, reply }) => {
  const ownerId = global.owner + "@s.whatsapp.net";
  if (sender !== ownerId) return reply(`| 🚫 *${global.mess.owner}*`);

  const uptime = prettyMs(process.uptime() * 1000, { verbose: true });
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const usedMem = (totalMem - freeMem).toFixed(2);
  const storage = `${usedMem} GB / ${totalMem} GB`;

  const hostname = os.hostname();
  const platform = os.platform();
  const arch = os.arch();
  const cpu = os.cpus()[0].model;
  const device = os.type();
  const model = os.version();

  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString();

  let locationInfo = {};
  try {
    const res = await fetch("https://ipapi.co/json");
    locationInfo = await res.json();
  } catch (err) {
    locationInfo = { error: "Could not fetch location info" };
  }

  const {
    ip,
    city,
    region,
    postal,
    country_name,
    org,
    latitude,
    longitude,
    in_eu,
  } = locationInfo;

  const connectionType = in_eu ? "WiFi" : "Cellular / Data (guessed)";

  let output = `
| 🖥️ *Server Information*

• 🧠 *OS:* ${platform} (${arch})
• 🏷️ *Hostname:* ${hostname}
• 📱 *Device:* ${device}
• 📦 *Model:* ${model}
• 💾 *CPU:* ${cpu}
• 🧮 *RAM Used:* ${usedMem} GB
• 📂 *Storage:* ${storage}

┃ 🌐 *Network Info*
• 🛰️ *ISP:* ${org || "N/A"}
• 🏙️ *City:* ${city || "N/A"}
• 🗺️ *Region:* ${region || "N/A"}
• 🌍 *Country:* ${country_name || "N/A"}
• 📮 *ZIP:* ${postal || "N/A"}
• 📌 *Lat, Long:* ${latitude || "?"}, ${longitude || "?"}
• 📶 *Connection:* ${connectionType}
• 🌐 *IP:* ${ip || "N/A"}

┃ ⏰ *Time & Uptime*
• 🕒 *Time:* ${time}
• 📆 *Date:* ${date}
• 🚀 *Uptime:* ${uptime}
  `.trim();

  await reply(output);
};

handler.help = ["server"];
handler.tags = ["owner"];
handler.command = ["server"];

module.exports = handler;
