require("../settings/config");
const { getUserCoins, updateUserCoins } = require("../database");
const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_SECONDS = 3600; // 1 hour

let handler = async (m, { sender, reply, client }) => {
  // Check and apply cooldown first
  const isOnCooldown = cooldown(COOLDOWN_SECONDS, "robbank")(client, m, []);
  if (isOnCooldown) return;

  const banks = [
    ["Bank of America", "New York"],
    ["Chase", "Los Angeles"],
    ["Wells Fargo", "Chicago"],
    ["Citibank", "Houston"],
    ["Capital One", "Miami"],
    ["Barclays", "London"],
    ["HSBC", "Hong Kong"],
    ["Deutsche Bank", "Berlin"],
  ];

  const [bank, city] = banks[Math.floor(Math.random() * banks.length)];
  const amount = Math.floor(Math.random() * 301) + 200;

  try {
    const coins = await getUserCoins(sender);
    await updateUserCoins(sender, coins + amount);

    await awardXp(100)(client, m);

    await reply(
      `┃ 🏦 *You successfully robbed ${bank} in ${city} and got ${amount} coins!*`
    );
  } catch (err) {
    console.error("[ERROR] Rob bank failed:", err);
    await reply("┃ ❌ *Failed to complete the bank robbery. Try again later.*");
  }
};

handler.help = ["robbank"];
handler.tags = ["economy"];
handler.command = ["robbank"];

module.exports = handler;
