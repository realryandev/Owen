let handler = async (m, { client, reply }) => {
  let uptime = Math.floor(process.uptime() * 1000);
  let format = (ms) => {
    let h = Math.floor(ms / 3600000),
      m = Math.floor(ms / 60000) % 60,
      s = Math.floor(ms / 1000) % 60;
    return `${h}h ${m}m ${s}s`;
  };
  try {
    let chats = Object.values(client.chats);
    let groups = chats.filter((c) => c.id.endsWith("@g.us"));
    reply(
      `┃ 🤖 *Owen Info:*\n⏱ Uptime: ${format(uptime)}\n👤 Users: ${chats.length - groups.length}\n👥 Groups: ${groups.length}\n🌐 Total Chats: ${chats.length}`
    );
  } catch (error) {
    console.error("Error in info command:", error);
    reply("Failed to fetch bot information.");
  }
};

handler.help = ["info"];
handler.tags = ["main"];
handler.command = ["info"];

module.exports = handler;