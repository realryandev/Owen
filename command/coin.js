const {
  getUserById,
  createUser,
  getUserCoins,
  updateUserCoins,
} = require("../database");

let handler = async (m, { sender, reply, pushName }) => {
  const userId = sender;
  const username = pushName || "Unknown";

  const user = await getUserById(userId);
  if (!user) {
    await createUser(userId, username);
  }

  const coins = await getUserCoins(userId);

  return reply(`┃ 💰 *Your coin balance is ${coins} coins*.`);
};

handler.help = ["coin"];
handler.tags = ["profile"];
handler.command = ["coin"];

module.exports = handler;
