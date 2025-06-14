require("../settings/config");
const {
  deleteUserById,
  getUserById,
} = require("../database");

let handler = async (m, { sender, reply, pushName }) => {
  const userId = sender;
  const username = pushName || "Unknown";

  const user = await getUserById(userId);
  if (!user) return reply("┃ ⚠️ *You don't have any data to reset.*");

  await deleteUserById(userId);
  await reply(`┃ 🔄 *${username}, your data has been reset successfully.*`);
};

handler.help = ["reset"];
handler.tags = ["economy"];
handler.command = ["reset"];

module.exports = handler;
