const { getUserCoins, updateUserCoins } = require('../database');
const awardXp = require('../awardxp');

const cooldownSeconds = 600;

function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function safeGetUserCoins(userId) {
  let coins = await getUserCoins(userId);
  if (coins === undefined || coins === null) {
    coins = 0;
    await updateUserCoins(userId, coins);
  }
  return coins;
}

async function robCommand(m, { client }) {
  try {
    const chat = await client.groupMetadata(m.chat);
    const adminIds = chat.participants
      .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
      .map(p => p.id);

    const eligibleUserIds = chat.participants
      .filter(p => p.id !== m.sender && !adminIds.includes(p.id))
      .map(p => p.id);

    if (!eligibleUserIds || eligibleUserIds.length === 0) {
      return m.reply("┃ 🕵️ *No one to rob right now.*");
    }

    const targetId = getRandom(eligibleUserIds);
    const targetCoins = await safeGetUserCoins(targetId);
    const userCoins = await safeGetUserCoins(m.sender);

    if (targetCoins <= 0) {
      return m.reply("┃ 😕 *The target doesn't have enough coins to be robbed.*");
    }

    const stolen = Math.min(100, targetCoins);

    await updateUserCoins(m.sender, userCoins + stolen);
    await updateUserCoins(targetId, targetCoins - stolen);

    await awardXp(20)(client, m);

    await client.sendMessage(
      m.chat,
      { text: `┃ 🥷 *You robbed ${stolen} coins from a random stranger!*` },
      { quoted: m }
    );

  } catch (error) {
    console.error(error);
    return m.reply('┃ ⚠️ *An error occurred while trying to rob.*');
  }
}

robCommand.cooldown = cooldownSeconds;
robCommand.command = ['rob'];
robCommand.tags = ['economy'];
robCommand.help = ['rob'];

module.exports = robCommand;
