
/*─────────────────────────────────────────
  GitHub   : https://github.com/coderxsa   
  YouTube  : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/       
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q     
──────────────────────────────────────────*/

const axios = require('axios')

let handler = async (m, { client, text, reply, reaction, prefix, command }) => {
    if (!text) return reply(`\n*ex:* ${prefix + command} https://vt.tiktok.com/ZS6ahdced/\n`)

    let url = `https://coderx-api.onrender.com/v1/downloaders/coderx/download/tiktok?url=${encodeURIComponent(text)}`
    let res = await axios.get(url)

    await reaction(m.chat, "⚡")

    if (res.data && res.data.status === 200 && res.data.success && res.data.result) {
        let data = res.data.result
        let title = data.desc || "CODERX"
        let videoUrl = data.video
        let musicUrl = data.music
        let coverImage = data.author.avatar

        if (videoUrl) {
            const videoRes = await axios.get(videoUrl, { responseType: 'arraybuffer' })
            const contentType = videoRes.headers['content-type']

            if (contentType && contentType.includes('video')) {
                await client.sendMessage(m.chat, {
                    video: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: `🎥 *Video TikTok*\n\n📌 *caption:* ${title}`
                }, { quoted: m })

                if (musicUrl) {
                    await client.sendMessage(m.chat, {
                        audio: { url: musicUrl },
                        mimetype: "audio/mpeg",
                        ptt: true
                    }, { quoted: m })
                }
                return
            }
        }

        if (coverImage) {
            await client.sendMessage(m.chat, {
                image: { url: coverImage },
                caption: `🖼 *Pic TikTok*\n📌 *caption:* ${title}`
            }, { quoted: m })
        }

        if (musicUrl) {
            await client.sendMessage(m.chat, {
                audio: { url: musicUrl },
                mimetype: "audio/mpeg",
                ptt: true
            }, { quoted: m })
        }
    }
}

handler.help = ['downloader tiktok']
handler.tags = ['downloader']
handler.command = ["tiktok"]

module.exports = handler

