require("../settings/config");
const {
  getUserById,
  createUser,
  getUserCoins,
  updateUserCoins,
  addXp,
} = require("../database");
const cooldown = require("../cooldowns");

const spinDelay = new Map();

let handler = async (m, { sender, args = [], reply, client }) => {
  const userId = sender;
  const username = m.pushName || "Unknown";

  let user = await getUserById(userId);
  if (!user) {
    await createUser(userId, username);
    user = await getUserById(userId);
  }

  if (
    spinDelay.has(userId) &&
    spinDelay.get(userId) + 300 * 1000 > Date.now()
  ) {
    const remaining = Math.floor(
      (spinDelay.get(userId) + 300 * 1000 - Date.now()) / 1000
    );
    return reply(
      `| ⏳ *Wait ${Math.floor(remaining / 60)}m ${remaining % 60}s before using .slots again.*`
    );
  }

  const bet = parseInt(args[0]);
  if (!args[0] || isNaN(bet))
    return reply("| ❌ *Please enter a valid number between 1000 and 10000.*");
  if (bet < 1000) return reply("| 😓 *You need at least 1000 coins to play.*");
  if (bet > 10000) return reply("| 💸 *Max bet is 10000 coins.*");

  let coins = await getUserCoins(userId);
  if (coins < bet) return reply("| 😓 *You don't have enough coins to play.*");

  // Start slot spin
  const emojis = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎"];
  const result = [0, 0, 0].map(
    () => emojis[Math.floor(Math.random() * emojis.length)]
  );

  let msg = await client.sendMessage(m.chat, {
    text: "| 🎰 *Spinning the reels...*",
  });

  // Optional: Show spinning animation (simulate time delay)
  await new Promise((res) => setTimeout(res, 1000));

  const top = "*╔═════🎰═════╗*";
  const mid = `*║  ${result[0]} | ${result[1]} | ${result[2]}  ║*`;
  const bot = "*╚═════════════╝*";
  let winText = `${top}\n${mid}\n${bot}\n`;

  let payout = 0;
  if (result[0] === result[1] && result[1] === result[2]) {
    payout = bet * 3;
    winText += `| 🎉 *JACKPOT! You won ${payout} coins!*`;
  } else if (
    result[0] === result[1] ||
    result[1] === result[2] ||
    result[0] === result[2]
  ) {
    payout = bet * 2;
    winText += `| 🥳 *Two matched! You won ${payout} coins!*`;
  } else {
    winText += "| 😭 *No matches. You lost your bet.*";
  }

  // Update balance
  const newBalance = coins - bet + payout;
  await updateUserCoins(userId, newBalance);

  await client.sendMessage(m.chat, {
    text: winText + `\n| 💰 *New balance: ${newBalance} coins*`,
    edit: msg.key,
  });

  // Set cooldown
  spinDelay.set(userId, Date.now());
};

handler.help = ["slots"];
handler.tags = ["gamble"];
handler.command = ["slots"];
handler.before = [cooldown(5, "slots"), addXp(50)];

module.exports = handler;
  