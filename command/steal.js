require("../settings/config");
const {
  getUserById,
  createUser,
  getUserCoins,
  updateUserCoins,
  getAllUsersInGroup,
} = require("../database");

const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_SECONDS = 600;

let handler = async (
  m,
  { sender, reply, participants = [], pushName, client }
) => {
  const isOnCooldown = cooldown(COOLDOWN_SECONDS, "steal")(client, m, []);
  if (isOnCooldown) return;

  const userId = sender;
  const username = pushName || "Unknown";

  let user = await getUserById(userId);
  if (!user) {
    await createUser(userId, username);
    user = await getUserById(userId);
  }

  if (participants.length === 0) {
    return reply("┃ ❌ *No participants found to steal from.*");
  }

  const participantIds = participants.map((p) => p.id || p);
  const groupUsers = await getAllUsersInGroup(participantIds);

  const victims = groupUsers.filter((u) => u.user_id !== userId);
  if (!victims.length) return reply("| ❌ *No one to steal from.*");

  const victim = victims[Math.floor(Math.random() * victims.length)];
  const victimId = victim.user_id;
  const victimName = victim.username || victimId.split("@")[0];

  const stolen = Math.floor(Math.random() * 51) + 100;
  const victimCoins = await getUserCoins(victimId);

  if (victimCoins < stolen) {
    return reply("┃ 🚫 *Victim is too broke to steal from.*");
  }

  await updateUserCoins(victimId, victimCoins - stolen);
  const thiefCoins = await getUserCoins(userId);
  await updateUserCoins(userId, thiefCoins + stolen);

  await awardXp(50)(client, m);

  await reply(`┃ 🥷 You stole *${stolen}* coins from @${victimName}!`);
};

handler.help = ["steal"];
handler.tags = ["economy"];
handler.command = ["steal"];

module.exports = handler;
