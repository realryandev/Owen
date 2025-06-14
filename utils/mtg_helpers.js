const axios = require("axios");

async function getRandomMagicCard() {
  try {
    const response = await axios.get("https://api.scryfall.com/cards/random");
    return response.data;
  } catch (err) {
    console.error("Error fetching card data:", err.message);
    return null;
  }
}

function formatCardMessage(cardData) {
  if (!cardData) return ["┃ ❌ Invalid card data.", null];

  const name = cardData.name || "N/A";
  const typeLine = cardData.type_line || "N/A";
  const oracleText = cardData.oracle_text || "N/A";
  const power = cardData.power || "N/A";
  const toughness = cardData.toughness || "N/A";
  const rarity = cardData.rarity || "N/A";
  const colorIdentity =
    (cardData.color_identity || []).join(", ") || "Colorless";
  const imageUrl = cardData.image_uris?.normal || null;
  const cardPrice = Math.floor(Math.random() * (600 - 180 + 1)) + 180;

  let message = `┃ 🎉 You have viewed the card *${name}*\n`;
  message += `┃ *${typeLine}*\n\n`;
  message += `┃ 📜 *Description:* ${oracleText}\n\n`;

  if (power !== "N/A" && toughness !== "N/A") {
    message += `┃ 💪 *Power:* ${power}\n┃ 🗿 *Toughness:* ${toughness}\n\n`;
  }

  message += `┃ 🏷️ *Type:* ${typeLine}\n`;
  message += `┃ 🧬 *Color Identity:* ${colorIdentity}\n`;
  message += `┃ 🌟 *Rarity:* ${rarity}\n\n`;

  message += `┃ 💰 *Price:* ${cardPrice} coins\n\n`;
  message += `┃ 🎈 *Tip:* To buy use .mbuy`;

  return [message, imageUrl, name, cardPrice, power, toughness];
}

module.exports = {
  getRandomMagicCard,
  formatCardMessage,
};
