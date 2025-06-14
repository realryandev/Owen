require("../settings/config");
const { getUserCoins, updateUserCoins } = require("../database");
const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_SECONDS = 3600;

let handler = async (m, { client, sender, reply }) => {
  const isOnCooldown = cooldown(COOLDOWN_SECONDS, "decrypt")(client, m, []);
  if (isOnCooldown) return;

  try {
    const decryptionScenarios = [
      "┃ 🔐 You were hired to decrypt classified government files!",
      "┃ 📜 You successfully decrypted an ancient encrypted manuscript!",
      "┃ 🖥️ You cracked a company's encrypted server!",
      "┃ 🔍 You bypassed a highly secured algorithm!",
      "┃ 🧩 You solved a multi-layered encrypted puzzle!",
      "┃ 📡 You intercepted and decoded secret communications!",
      "┃ 🧠 You deciphered a neural network's security code!",
      "┃ 🛡️ You decrypted the vault of a digital bank!",
      "┃ 🛰️ You cracked an encrypted satellite transmission!",
      "┃ 👾 You unraveled a quantum encryption matrix!",
    ];

    const randomScenario =
      decryptionScenarios[
        Math.floor(Math.random() * decryptionScenarios.length)
      ];
    const reward = Math.floor(Math.random() * 201) + 600;

    const currentCoins = await getUserCoins(sender);
    await updateUserCoins(sender, currentCoins + reward);

    await awardXp(120)(client, m);

    await reply(
      `┃ 🔓 *Decryption Success*\n\n${randomScenario}\n\n💰 *You earned ${reward} coins!*`
    );
  } catch (err) {
    console.error("[ERROR] Decryption failed:", err);
    await reply(
      "⚠️┃ *An error occurred while decrypting. Please try again later.*"
    );
  }
};

handler.help = ["decrypt"];
handler.tags = ["economy"];
handler.command = ["decrypt"];

module.exports = handler;
