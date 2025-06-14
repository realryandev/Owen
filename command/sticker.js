
/*─────────────────────────────────────────
  GitHub   : https://github.com/coderxsa   
  YouTube  : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/       
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q     
──────────────────────────────────────────*/

require('../settings/config');
const fs = require('fs');

let handler = async (m, { client, text, reply, quoted, mime, prefix, command }) => {
    if (!quoted) return reply(`\n*ex:* reply image/video ${prefix + command}\n`);
    try {
        if (/image/.test(mime)) {
            let media = await quoted.download();
            let encmedia = await client.sendImageAsSticker(m.chat, media, m, {
                packname: packname,
                author: author,
            });
            await fs.unlinkSync(encmedia);
        } else if (/video/.test(mime)) {
            if ((quoted?.msg || quoted)?.seconds > 10) return reply('\nmaximum duration 10 seconds\n')
                const media = await quoted.download();
                let encmedia = await client.sendVideoAsSticker(m.chat, media, m, {
                    packname: packname,
                    author: author,
                });
            await fs.unlinkSync(encmedia);
        } else {
                return reply(`\n*ex:* reply image/video ${prefix + command}\n`);
        }
    } catch (error) {
        console.error(error);
        return reply('error');
    }
}

handler.help = ['sticker']
handler.tags = ['sticker']
handler.command = ['sticker', 's']

module.exports = handler
