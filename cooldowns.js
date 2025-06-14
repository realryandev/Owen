const cooldowns = new Map();

function cooldown(seconds, commandName) {
  return (sock, msg, args) => {
    const userId = msg.sender || msg.key.participant || msg.key.remoteJid;

    const now = Date.now();
    const key = `${userId}-${commandName}`;
    const lastUsed = cooldowns.get(key) || 0;

    if (now - lastUsed < seconds * 1000) {
      const remaining = Math.ceil((seconds * 1000 - (now - lastUsed)) / 1000);

      sock.sendMessage(
        msg.key.remoteJid,
        {
          text: `┃ 🕑 *This command is on cooldown. Try again in ${remaining}s*.`,
        },
        { quoted: msg }
      );

      return true;
    }

    cooldowns.set(key, now);
    return false;
  };
}

module.exports = cooldown;
