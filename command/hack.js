require("../settings/config");
const { getUserCoins, updateUserCoins } = require("../database");
const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_SECONDS = 3600;

let handler = async (m, { sender, reply, client }) => {
  const isOnCooldown = cooldown(COOLDOWN_SECONDS, "hack")(client, m, []);
  if (isOnCooldown) return;

  const hackingScenarios = [
    "┃ 💻 You hacked into a government database!",
    "┃ 🛰️ You breached a satellite server!",
    "┃ 📱 You cracked into a millionaire’s smartphone!",
    "┃ 🔓 You exploited a major social media site!",
    "┃ 🛡️ You bypassed a top-tier firewall!",
    "┃ 🧠 You outsmarted an AI security system!",
    "┃ 💳 You infiltrated a digital bank system!",
    "┃ 📡 You hijacked a communication satellite!",
    "┃ 🔍 You found a backdoor into a megacorp!",
    "┃ 🕶️ You completed a stealth hack on an encrypted network!"
  ];

  const randomScenario = hackingScenarios[Math.floor(Math.random() * hackingScenarios.length)];
  const reward = Math.floor(Math.random() * 301) + 200;

  try {
    const currentCoins = await getUserCoins(sender);
    await updateUserCoins(sender, currentCoins + reward);

    await awardXp(100)(client, m);

    await reply(`┃ 🧠 *Hack Success*\n\n${randomScenario}\n\n💰 *You earned ${reward} coins!*`);
  } catch (err) {
    console.error("[ERROR] Hack failed:", err);
    await reply("┃ ❌ *Failed to complete the hack. Please try again later.*");
  }
};

handler.help = ["hack"];
handler.tags = ["economy"];
handler.command = ["hack"];

module.exports = handler;
