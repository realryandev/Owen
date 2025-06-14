require("../settings/config");
const {
  getUserById,
  createUser,
  getUserCoins,
  updateUserCoins,
  findUserByNameOrId,
} = require("../database");

let handler = async (m, { sender, args, reply, mentionedJid }) => {
  const ownerId = global.owner + "@s.whatsapp.net";
  if (sender !== ownerId) return reply(`| 🚫 *${global.mess.owner}*`);

  const targetId = mentionedJid[0] || (await findUserByNameOrId(args[0]));
  const amount = parseInt(args[1] || args[0]);

  if (!targetId || isNaN(amount) || amount <= 0)
    return reply("┃ ❌ *Usage:* .addcoins @user 1000");

  let target = await getUserById(targetId);
  if (!target) await createUser(targetId, "Unknown");

  const currentCoins = await getUserCoins(targetId);
  await updateUserCoins(targetId, currentCoins + amount);

  await reply(
    `┃ 💰 *Added ${amount} coins to @${targetId.split("@")[0]} successfully!*`
  );
};

handler.help = ["addcoins"];
handler.tags = ["owner"];
handler.command = ["addcoins"];

module.exports = handler;
