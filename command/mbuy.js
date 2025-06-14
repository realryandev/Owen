require("../settings/config");
const axios = require("axios");
const {
  getUserCoins,
  updateUserCoins,
  getLastViewedCard,
  addXp
} = require("../database");
const { formatCardMessage } = require("../utils/mtg_helpers");
const cooldown = require("../cooldowns");

let handler = async (m, { client, reply, sender }) => {
  const userId = sender;

  const lastCard = await getLastViewedCard(userId);

  if (!lastCard) {
    return reply("┃ 😢 *You haven't viewed a card yet! Use .mage first*.");
  }

  const { card_name, card_price, card_power, card_toughness } = lastCard;

  const coins = await getUserCoins(userId);
  if (coins < card_price) {
    return reply(
      `┃ ❌ You need \`${card_price}\` coins to buy \`${card_name}\`. You only have \`${coins}\`.`
    );
  }

  await updateUserCoins(userId, coins - card_price);

  let cardData = {};
  try {
    const res = await axios.get(
      `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
        card_name
      )}`
    );
    cardData = res.data;
  } catch (e) {
    console.error("Failed to fetch card data:", e.message);
  }

  const [baseMessage, imageUrl] = formatCardMessage(cardData);
  const balanceInfo = `\n\n┃ 💼 *Remaining Balance:* ${coins - card_price} coins`;
  const finalMessage =
    (typeof baseMessage === "string"
      ? baseMessage
      : "┃ 🛑 Card info missing.") + balanceInfo;

  // Record the purchase
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database("./database.db");
  db.run(
    `INSERT INTO purchases (user_id, card_name, purchase_timestamp, card_price, card_power, card_toughness)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      card_name,
      Math.floor(Date.now() / 1000),
      card_price,
      card_power,
      card_toughness,
    ]
  );
  db.close();

  if (imageUrl) {
    await client.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: finalMessage,
    });
  } else {
    await reply(finalMessage);
  }
};

handler.help = ["mbuy"];
handler.tags = ["magic"];
handler.command = ["mbuy"];
handler.before = [cooldown(10, "mbuy"), addXp(60)];

module.exports = handler;
