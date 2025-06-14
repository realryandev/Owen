require("../settings/config");
const sqlite3 = require("sqlite3").verbose();
const { getUserById, createUser, addXp } = require("../database");
const {
  getRandomMagicCard,
  formatCardMessage,
} = require("../utils/mtg_helpers");
const cooldown = require("../cooldowns");
const { DB_FILE } = require("../settings/config");

let handler = async (m, { client, sender, reply }) => {
  const userId = sender;

  try {
    if (!(await getUserById(userId))) {
      await createUser(userId, m.pushName || "unknown");
    }

    const cardData = await getRandomMagicCard();
    if (!cardData) {
      return reply("Failed to retrieve a Magic card.");
    }

    const [message, imageUrl, name, cardPrice, power, toughness] =
      formatCardMessage(cardData);

    await client.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: message,
    });

    const db = new sqlite3.Database(DB_FILE);
    db.run(
      `
          INSERT INTO card_views (user_id, card_name, timestamp, card_price, card_power, card_toughness)
          VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        name,
        Math.floor(Date.now() / 1000),
        cardPrice,
        power,
        toughness,
      ],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          reply("An error occurred while saving card data.");
        }
        db.close();
      }
    );
  } catch (error) {
    console.error("Error in mage command:", error);
    reply("An unexpected error occurred.");
  }
};

handler.help = ["mage"];
handler.tags = ["magic"];
handler.command = ["mage"];

module.exports = handler;
