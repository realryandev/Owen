const { getUserById, queryAll } = require("../database");
const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_SECONDS = 5;

let handler = async (m, { client, sender, reply }) => {
  try {
    const users = await queryAll(`
      SELECT user_id, username, wins
      FROM users
      ORDER BY wins DESC, username ASC
      LIMIT 20
    `);

    if (!users || users.length === 0) {
      return reply("🏆 No users found in the leaderboard.");
    }

    let message = `┃ 🥇 *Top Fighters Leaderboard*\n\n`;

    users.forEach((user, index) => {
      const name = user.username || user.user_id.replace(/@s\.whatsapp\.net$/, "");
      const wins = user.wins || 0;
      message += `*${index + 1}. ${name}* — 🏆 ${wins} wins\n`;
    });

    // Award XP for checking leaderboard
    await awardXp(15)(client, m);

    await reply(message.trim());
  } catch (err) {
    console.error("Leaderboard error:", err);
    return reply("⚠️ Failed to load leaderboard. Try again later.");
  }
};

handler.cooldown = COOLDOWN_SECONDS;
handler.help = ["lb"];
handler.tags = ["magic"];
handler.command = ["lb"];

module.exports = handler;
