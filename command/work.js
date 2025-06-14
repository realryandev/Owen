require("../settings/config");
const {
  getUserById,
  createUser,
  getUserCoins,
  updateUserCoins,
} = require("../database");

const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_SECONDS = 600;

let handler = async (m, { sender, reply, pushName, client }) => {
  const userId = sender;
  const username = pushName || "Unknown";

  const isOnCooldown = cooldown(COOLDOWN_SECONDS, "work")(client, m, []);
  if (isOnCooldown) return;

  let user = await getUserById(userId);
  if (!user) {
    await createUser(userId, username);
    user = await getUserById(userId);
  }

  const earnings = Math.floor(Math.random() * 110) + 100;
  const currentCoins = await getUserCoins(userId);
  const newBalance = currentCoins + earnings;

  try {
    await updateUserCoins(userId, newBalance);

    await awardXp(75)(client, m);

    await reply(`┃ 💼 You worked a shift and earned *${earnings}* coins!`);
  } catch (err) {
    console.error("[ERROR] Failed to update coins:", err);
    await reply("┃ ❌ *Failed to update your coins. Please try again later.*");
  }
};

handler.help = ["work"];
handler.tags = ["economy"];
handler.command = ["work"];

module.exports = handler;
