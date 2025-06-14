const axios = require('axios');

let handler = async (m, { reply, args }) => {
  if (!args[0]) return reply('| 🔎 Usage: .search <query>');
  try {
    let { data } = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(args.join(' '))}&format=json`);
    if (!data.Abstract) return reply('| ❌ No results found.');
    reply(`┃ 🔎 *${data.Heading}*\n\n${data.Abstract}`);
  } catch (e) {
    console.error(e);
    reply('┃ ❌ Failed to search.');
  }
};

handler.help = ['search <query>'];
handler.tags = ['info'];
handler.command = ['search'];

module.exports = handler;
