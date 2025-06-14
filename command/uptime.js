require("../settings/config");

let handler = async (m, { reply }) => {
  const uptimeMs = process.uptime() * 1000;
  const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
  const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((uptimeMs % (1000 * 60)) / 1000);
  await reply(`┃ ⏱️ *Owen Uptime:* ${hours}h ${minutes}m ${seconds}s`);
};

handler.help = ["uptime"];
handler.tags = ["info"];
handler.command = ["uptime"];

module.exports = handler;
