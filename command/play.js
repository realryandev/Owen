require('../settings/config');
const axios = require('axios');

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} faded\n`)
    await reaction(m.chat, '⚡')
    
    let url = `https://coderx-api.onrender.com/v1/downloaders/coderx/download/ytmp3v2?query=hello${encodeURIComponent(text)}`;
    let res = await axios.get(url);
    
    if (res.data && res.data.success && res.data.result) {
        let audioUrl = res.data.result.download.audio;
        
        if (audioUrl) {
            client.sendMessage(m.chat, {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg", 
                ptt: true
            }, { quoted: m });
        } else {
            reply("⚠️ Failed to retrieve audio.");
        }
    } else {
        reply("⚠️ No results found.");
    }
}

handler.help = ['downloader music'];
handler.tags = ['downloader'];
handler.command = ["play"];

module.exports = handler;