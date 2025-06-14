let handler = async (m, { quoted, mime, client, reply }) => {
  if (!quoted || !/audio|video/.test(mime))
    return reply("*Reply to an audio or video message.*");
  let media = await quoted.download();
  await client.sendMessage(
    m.chat,
    { audio: media, mimetype: "audio/ogg; codecs=opus", ptt: true },
    { quoted: m }
  );
};

handler.help = ["tovn"];
handler.tags = ["tools"];
handler.command = ["tovn"];

module.exports = handler;
