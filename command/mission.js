require("../settings/config");
const { getUserCoins, updateUserCoins } = require("../database");
const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const COOLDOWN_SECONDS = 3600;

let handler = async (m, { client, sender, reply }) => {
  const isOnCooldown = cooldown(COOLDOWN_SECONDS, "mission")(client, m, []);
  if (isOnCooldown) return;

  try {
    const missionScenarios = [
      "┃ 🛰️ You sabotaged a rogue satellite in orbit!",
      "┃ 🔍 You retrieved secret files from a high-security vault!",
      "┃ 🕶️ You completed a stealth infiltration of a megacorp!",
      "┃ 📡 You hijacked enemy communication lines undetected!",
      "┃ 🚁 You extracted a VIP from hostile territory!",
      "┃ 🔒 You planted a virus inside a digital fortress!",
      "┃ 🎯 You neutralized a rival hacker group!",
      "┃ 🧠 You cracked the AI defense grid controlling a city!",
      "┃ 💣 You disarmed a ticking cyber bomb!",
      "┃ 🏛️ You exposed a global conspiracy hidden deep in the dark web!"
    ];

    const randomMission = missionScenarios[Math.floor(Math.random() * missionScenarios.length)];
    const reward = Math.floor(Math.random() * 1001) + 1000;

    const currentCoins = await getUserCoins(sender);
    await updateUserCoins(sender, currentCoins + reward);

    await awardXp(150)(client, m);

    await reply(
      `┃ 🎯 *Mission Completed*\n\n${randomMission}\n\n💰 *You earned ${reward} coins!*`
    );
  } catch (err) {
    console.error("[ERROR] Mission failed:", err);
    await reply("⚠️┃ *An error occurred while completing the mission. Please try again later.*");
  }
};

handler.help = ["mission"];
handler.tags = ["economy"];
handler.command = ["mission"];

module.exports = handler;
