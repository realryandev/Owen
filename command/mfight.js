require("../settings/config");
const {
  getUserById,
  createUser,
  getUserInventory,
  removeFromInventory,
  getUserByUsername,
  getUserByPhoneNumber,
  getUserCoins,
  updateUserCoins,
  recordFight,
  recordPurchase,
} = require("../database");

const awardXp = require("../awardxp");
const cooldownMap = new Map();
const COOLDOWN_TIME = 600 * 1000;

let handler = async (
  m,
  { sender, args, reply, client, participants, quoted, pushName }
) => {
  const userId = sender;
  const username = pushName || "Unknown";

  const cooldownKey = `${userId}-mfight`;
  const lastUsed = cooldownMap.get(cooldownKey);
  if (lastUsed && Date.now() - lastUsed < COOLDOWN_TIME) {
    const remaining = Math.ceil(
      (COOLDOWN_TIME - (Date.now() - lastUsed)) / 1000
    );
    return reply(
      `┃ ⏱️ *You must wait ${remaining}s before using this command again.*`
    );
  }

  if (!(await getUserById(userId))) {
    await createUser(userId, username);
  }

  let opponent = null;
  let opponentId = null;

  if (quoted) {
    opponentId = quoted.participant || quoted.sender || quoted.key?.participant;
    const found = await getUserById(opponentId);
    if (!found) await createUser(opponentId, "Unknown");
    opponent = await getUserById(opponentId);
  } else if (args.length) {
    let identifier = args[0].replace("@", "");
    opponent = await getUserByUsername(identifier);
    if (!opponent && identifier.startsWith("+")) {
      opponent = await getUserByPhoneNumber(identifier);
    }

    if (opponent) opponentId = opponent.user_id;
  }

  if (!opponent || !opponentId) {
    return reply(
      "❌ ┃ 👤 *User not found. Make sure they've used the bot at least once with .start or .mbuy.*"
    );
  }

  if (opponentId === userId) {
    return reply("┃ ❌ *You cannot fight yourself*.");
  }

  const userInventory = await getUserInventory(userId);
  const opponentInventory = await getUserInventory(opponentId);

  if (!userInventory.length) {
    return reply("┃ ❌ *You have no cards to fight with*.");
  }

  if (!opponentInventory.length) {
    return reply("┃ ❌ *Your opponent has no cards to fight with*.");
  }

  const userPower = userInventory.reduce((acc, c) => acc + parseInt(c[3]), 0);
  const opponentPower = opponentInventory.reduce(
    (acc, c) => acc + parseInt(c[3]),
    0
  );

  const winnerId = userPower >= opponentPower ? userId : opponentId;
  const loserId = winnerId === userId ? opponentId : userId;

  const winnerName = winnerId === userId ? username : opponent.username;
  const loserName = winnerId === userId ? opponent.username : username;

  const loserInventory = await getUserInventory(loserId);

  cooldownMap.set(cooldownKey, Date.now());

  await recordFight(winnerId, loserId);
  await awardXp(20)(client, m);

  if (loserInventory.length) {
    const stolenCard =
      loserInventory[Math.floor(Math.random() * loserInventory.length)];
    await removeFromInventory(loserId, stolenCard[0]);
    await recordPurchase(
      winnerId,
      stolenCard[0],
      stolenCard[2],
      stolenCard[3],
      stolenCard[4],
      stolenCard[5]
    );

    const coinsWon = Math.floor(Math.random() * 16) + 5;
    const winnerCoins = await getUserCoins(winnerId);
    await updateUserCoins(winnerId, winnerCoins + coinsWon);

    return reply(
      `┃ 🥊 ${username} fought ${opponent.username} and *${winnerId === userId ? "won" : "lost"}* the battle!\n` +
        `┃ 🎁 *${winnerName}* won the card *${stolenCard[0]}* and 💰 *${coinsWon}* coins from *${loserName}*!`
    );
  } else {
    return reply(
      `┃ 🥊 ${username} fought ${opponent.username} and *${winnerId === userId ? "won" : "lost"}* the battle!\n` +
        `┃ 😥 *${loserName}* had no cards left to steal.`
    );
  }
};

handler.help = ["mfight"];
handler.tags = ["magic"];
handler.command = ["mfight"];

module.exports = handler;
