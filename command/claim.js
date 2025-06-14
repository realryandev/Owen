require("../settings/config");
const { getUserById, getUserCoins, updateUserCoins } = require("../database");
const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_TIMES = {
  daily: 24 * 60 * 60,
  weekly: 7 * 24 * 60 * 60,
  monthly: 30 * 24 * 60 * 60,
  yearly: 365 * 24 * 60 * 60,
};

const CLAIM_REQUIREMENTS = {
  daily: { level: 15, reward: 1000 },
  weekly: { level: 30, reward: 5000 },
  monthly: { level: 75, reward: 50000 },
  yearly: { level: 100, reward: 1000000 },
};

let handler = async (m, { client, sender, reply, args }) => {
  try {
    const type = (args[0] || "").toLowerCase();

    if (!["daily", "weekly", "monthly", "yearly"].includes(type)) {
      return reply(
        `┃ 📜 *Usage:*\n• .claim daily\n• .claim weekly\n• .claim monthly\n• .claim yearly`
      );
    }

    const user = await getUserById(sender);
    if (!user) {
      return reply("❌┃ *User not found. Please register first.*");
    }

    const { level } = user;
    const required = CLAIM_REQUIREMENTS[type];

    if (level < required.level) {
      return reply(
        `🚫┃ *You must be at least Level ${required.level} to claim your ${type} reward.*`
      );
    }

    const isOnCooldown = cooldown(COOLDOWN_TIMES[type], `claim_${type}`)(
      client,
      m,
      []
    );
    if (isOnCooldown) return;

    const currentCoins = await getUserCoins(sender);
    await updateUserCoins(sender, currentCoins + required.reward);

    await awardXp(100)(client, m);

    await reply(
      `┃ 🎁 *${type.toUpperCase()} CLAIM SUCCESS*\n\n` +
        `🏆 *Reward:* ${required.reward} coins\n` +
        `🧠 *Your Level:* ${level}\n\n` +
        `📈 *Keep leveling up to unlock bigger rewards!*`
    );
  } catch (err) {
    console.error("Claim Command Error:", err);
    await reply(
      "⚠️┃ *An error occurred during the claim process. Please try again later.*"
    );
  }
};

handler.help = ["claim [daily|weekly|monthly|yearly]"];
handler.tags = ["economy"];
handler.command = ["claim"];

module.exports = handler;
