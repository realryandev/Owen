require("../settings/config");
const { getUserCoins, updateUserCoins } = require("../database");
const cooldown = require("../cooldowns");
const awardXp = require("../awardxp");

const SUCCESS_COOLDOWN_SECONDS = 7200;
const FAIL_COOLDOWN_SECONDS = 14400;

let handler = async (m, { client, sender, reply }) => {
  try {
    const isSuccess = Math.random() < 0.5;

    if (isSuccess) {
      const isOnCooldown = cooldown(SUCCESS_COOLDOWN_SECONDS, "heist_success")(
        client,
        m,
        []
      );
      if (isOnCooldown) return;

      const heistScenarios = [
        "┃ 🏦 You masterminded a successful bank heist!",
        "┃ 🚛 You hijacked a gold shipment on the highway!",
        "┃ 💎 You stole priceless jewels from a billionaire's vault!",
        "┃ 🔫 You outsmarted a high-security casino!",
        "┃ 🚀 You escaped with alien technology!",
      ];

      const randomHeist =
        heistScenarios[Math.floor(Math.random() * heistScenarios.length)];
      const reward = Math.floor(Math.random() * 1001) + 3000;

      const currentCoins = await getUserCoins(sender);
      await updateUserCoins(sender, currentCoins + reward);

      await awardXp(200)(client, m);

      await reply(
        `┃ 🏴‍☠️ *Heist Success*\n\n${randomHeist}\n\n💰 *You earned ${reward} coins!*`
      );
    } else {
      const isOnCooldown = cooldown(FAIL_COOLDOWN_SECONDS, "heist_fail")(
        client,
        m,
        []
      );
      if (isOnCooldown) return;

      const failScenarios = [
        "┃ 🚓 You got caught by security forces!",
        "┃ 🧨 Your plan backfired spectacularly!",
        "┃ 🕵️ An undercover agent set you up!",
        "┃ 📡 Your communication was intercepted!",
        "┃ 🔒 You triggered an alarm and got surrounded!",
      ];

      const randomFail =
        failScenarios[Math.floor(Math.random() * failScenarios.length)];
      const loss = Math.floor(Math.random() * 1001) + 3000; // 3000 - 4000 coins

      const currentCoins = await getUserCoins(sender);

      if (currentCoins >= loss) {
        await updateUserCoins(sender, currentCoins - loss);
        await awardXp(50)(client, m);

        await reply(
          `┃ ❌ *Heist Failed*\n\n${randomFail}\n\n💸 *You lost ${loss} coins!*`
        );
      } else {
        await awardXp(20)(client, m);

        await reply(
          `┃ ❌ *Heist Failed Badly*\n\n${randomFail}\n\n🤕 *You had no money! You got beaten up instead!*`
        );
      }
    }
  } catch (err) {
    console.error("Heist Command Error:", err);
    await reply(
      "⚠️┃ *An error occurred during the heist. Please try again later.*"
    );
  }
};

handler.help = ["heist"];
handler.tags = ["economy"];
handler.command = ["heist"];

module.exports = handler;
