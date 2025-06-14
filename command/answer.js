let handler = async (m, { reply }) => {
  let a = global.riddleStore?.[m.sender];
  reply(a ? `┃ ✅ Answer: ${a}` : "❌ No riddle found. Use *.riddle* first.");
};

handler.help = ["answer"];
handler.tags = ["fun"];
handler.command = ["answer"];

module.exports = handler;
