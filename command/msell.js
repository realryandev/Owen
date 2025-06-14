require("../settings/config");
const {
  getUserById,
  createUser,
  getUserInventory,
  removeFromInventory,
  getUserCoins,
  updateUserCoins,
} = require("../database");

let handler = async (m, { sender, text, pushName, reply }) => {
  const userId = sender;
  const username = pushName || "Unknown";

  const user = await getUserById(userId);
  if (!user) {
    await createUser(userId, username);
  }

  const inventory = await getUserInventory(userId);
  if (!inventory || inventory.length === 0) {
    return reply("┃ 😔 *You don't have any cards to sell*.");
  }

  if (!text) {
    return reply(
      "┃ 🤲🏿 *Please specify the exact card name to sell (e.g., .msell Card Name)*."
    );
  }

  const cardToSell = text.trim();
  let found = false;

  for (const item of inventory) {
    const cardName = item.card_name;
    const cardPrice = item.card_price;

    if (cardName.toLowerCase() === cardToSell.toLowerCase()) {
      await removeFromInventory(userId, cardName);

      const salePrice = Math.floor(cardPrice * 0.8);
      const currentCoins = await getUserCoins(userId);
      await updateUserCoins(userId, currentCoins + salePrice);

      await reply(
        `┃ 🤑 Sold *${cardName}* for *${salePrice}* coins!\n┃ 💰 New Balance: *${currentCoins + salePrice}* coins`
      );
      found = true;
      break;
    }
  }

  if (!found) {
    await reply(
      `┃ ⚠️ Card '*${cardToSell}*' not found in your inventory.\n| 📛 Please enter the exact card name.`
    );
  }
};

handler.help = ["msell"];
handler.tags = ["magic"];
handler.command = ["msell"];

module.exports = handler;
