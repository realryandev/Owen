let handler = async (m, { text, client, reply }) => {
  if (!text) return reply("*ex:* .tts Hello world");
  let url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(text)}&tl=en`;
  await client.sendMessage(
    m.chat,
    { audio: { url }, mimetype: "audio/mpeg", ptt: true },
    { quoted: m }
  );
};

handler.help = ["tts <text>"];
handler.tags = ["tools"];
handler.command = ["tts"];

module.exports = handler;
