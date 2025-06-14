require("../settings/config");
const {
  getUserById,
  createUser,
  getUserCoins,
  updateUserCoins,
  findUserByNameOrId,
} = require("../database");

let handler = async (
  m,
  { sender, args, reply, pushName, mentionedJid = [] }
) => {
  const userId = sender;
  const username = pushName || "Unknown";

  let user = await getUserById(userId);
  if (!user) await createUser(userId, username);

  const targetId =
    mentionedJid.length > 0
      ? mentionedJid[0]
      : await findUserByNameOrId(args[0]);
  const amount = parseInt(args[1] || args[0]);

  if (!targetId || targetId === userId || isNaN(amount) || amount <= 0) {
    return reply("┃ ❌ *Usage:* .give @user 100");
  }

  let target = await getUserById(targetId);
  if (!target) await createUser(targetId, "Unknown");

  const userCoins = await getUserCoins(userId);
  if (userCoins < amount) {
    return reply("┃ 💸 *You don't have enough coins to give.*");
  }

  await updateUserCoins(userId, userCoins - amount);
  const targetCoins = await getUserCoins(targetId);
  await updateUserCoins(targetId, targetCoins + amount);

  await reply(`┃ 🤝 You gave *${amount}* coins to @${targetId.split("@")[0]}!`);
};

handler.help = ["give"];
handler.tags = ["economy"];
handler.command = ["give"];

module.exports = handler;
