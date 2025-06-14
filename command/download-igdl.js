/*─────────────────────────────────────────
  GitHub   : https://github.com/coderxsa   
  YouTube  : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/       
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q     
──────────────────────────────────────────*/

require("../settings/config");
const axios = require("axios");

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
  if (!text)
    return reply(
      `\n*ex:* ${prefix + command} https://www.instagram.com/reel/DB8BGCZRKAh/?igsh=eDajRncDV6Mjdh`
    );
  await reaction(m.chat, "⚡");

  let url = `https://coderx-api.onrender.com/v1/downloaders/coderx/download/instagram?url=${encodeURIComponent(text)}`;
  let res = await axios.get(url);

  if (res.data && res.data.success && res.data.downloadUrl) {
    let mediaUrl = res.data.downloadUrl;

    try {
      const headResponse = await axios.head(mediaUrl);
      const mimeType = headResponse.headers["content-type"];

      if (/image\/.*/.test(mimeType)) {
        await client.sendMessage(
          m.chat,
          {
            image: { url: mediaUrl },
            caption: "Successfully downloaded image from URL.",
          },
          { quoted: m }
        );
      } else if (
        /video\/.*/.test(mimeType) ||
        mimeType === "application/octet-stream"
      ) {
        await client.sendMessage(
          m.chat,
          {
            video: { url: mediaUrl },
            caption: "Successfully downloaded video from URL.",
          },
          { quoted: m }
        );
      } else {
        await client.sendMessage(
          m.chat,
          {
            text: `Unsupported media type: ${mimeType}`,
          },
          { quoted: m }
        );
      }
    } catch (error) {
      console.error(error);
      reply("⚠️ Error processing media.");
    }
  } else {
    reply("⚠️ No media found or an error occurred while retrieving media.");
  }
};

handler.help = ["downloader instagram"];
handler.tags = ["downloader"];
handler.command = ["igdl"];

module.exports = handler;
