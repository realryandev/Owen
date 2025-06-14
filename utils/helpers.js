function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return hours
    ? `${hours}h ${minutes}m ${remainingSeconds}s`
    : `${minutes}m ${remainingSeconds}s`;
}

function getUserMention(msg) {
  const username = msg.pushName || "User";
  const id = msg.participant || msg.key.participant || msg.key.remoteJid;
  return `@${username}`; // WhatsApp can't tag by @username, but placeholder is useful
}

function parseCommandArgs(args = [], expected) {
  if (args.length < expected) return null;
  return args.slice(0, expected);
}

function formatInventoryCard(card) {
  const [cardName, timestamp, price, power, toughness] = card;
  const date = new Date(timestamp * 1000).toLocaleString("en-ZA");
  return (
    `┃ *${cardName}* (Purchased: ${date}, Price: ${price} coins)\n` +
    `┃ Power: ${power}, Toughness: ${toughness}\n`
  );
}

module.exports = {
  formatTime,
  getUserMention,
  parseCommandArgs,
  formatInventoryCard,
};
