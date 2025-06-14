const { getUserById, addXp } = require("./database");

function awardXp(amount = 10) {
  return async (sock, msg) => {
    try {
      const userId = msg.participant || msg.key.remoteJid;
      const chatId = msg.key.remoteJid;

      const user = await getUserById(userId);
      if (!user) return false;

      const { level, leveledUp, disableLevelupMsg } = await addXp(
        userId,
        amount
      );

      if (leveledUp && !disableLevelupMsg) {
        await sock.sendMessage(
          chatId,
          {
            text: `┃ 🎉 *You leveled up to Level ${level}!*`,
          },
          { quoted: msg }
        );
      }
    } catch (err) {
      console.error("Error in awardXp", err);
    }

    return false;
  };
}

module.exports = awardXp;
