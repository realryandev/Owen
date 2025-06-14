require("../settings/config");
const { getUserById, createUser, getUserInventory } = require("../database");

let handler = async (m, { sender, pushName, reply }) => {
  const userId = sender;
  const username = pushName || "Unknown";

  console.log(`🧙 .minv triggered by ${username} (${userId})`);

  const user = await getUserById(userId);
  if (!user) {
    await createUser(userId, username);
  }

  const inventory = await getUserInventory(userId);

  if (!inventory || inventory.length === 0) {
    return reply("┃ 📦 *You don't own any Magic cards yet*.");
  }

  let message = "┃ 📜 *Your Magic Card Inventory*:\n\n";
  message += "┃ # ┃ 🃏 Card ┃ 💪 Power ┃ 🛡️ Toughness ┃ 💰 Price ┃\n";
  message += "|:--:|:--|:--:|:--:|:--:|\n";

  for (let i = 0; i < inventory.length; i++) {
    const item = inventory[i];
    const name = item.card_name || "Unknown";
    const price = item.card_price ?? 0;
    const power = item.card_power ?? "-";
    const toughness = item.card_toughness ?? "-";

    message += `| ${i + 1} | *${name}* | ${"`" + power + "`"} | ${"`" + toughness + "`"} | ${"`" + price + "`"} coins |\n`;
  }
  console.log("Inventory data:", inventory);
  await reply(message);
  console.log("Sent message:\n", message);
};

handler.help = ["minv"];
handler.tags = ["magic"];
handler.command = ["minv"];

module.exports = handler;
