

/*─────────────────────────────────────────
  GitHub   : https://github.com/coderxsa   
  YouTube  : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/       
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q     
──────────────────────────────────────────*/

const fs = require("fs")
const path = require("path")

let handler = async (m, { reply, command, prefix, sleep }) => {
    let directoryPath = path.join('./start/tmp')
    fs.readdir(directoryPath, 
               async function (err, files) {
        if (err) return reply('\nunable to scan directory: ' + err + '\n');
        
        let filteredArray = await files.filter(item => item.endsWith("gif") || 
                                               item.endsWith("png") ||
                                               item.endsWith("mp3") ||
                                               item.endsWith("mp4") || 
                                               item.endsWith("jpg") || 
                                               item.endsWith("jpeg") || 
                                               item.endsWith("webp") ||
                                               item.endsWith("webm") 
                                            )
        let teks = `\ndetected ${filteredArray.length} junk files\n\n`
        if (filteredArray.length == 0) return reply(teks)
        filteredArray.map(function(e, i){
            teks += (i+1)+`. ${e}\n`
        })
        
        reply(teks)
        await sleep(2000)
        reply("\ndelete junk files...\n")
        await filteredArray.forEach(function (file) {
            fs.unlinkSync(`./start/tmp/${file}`)
        });
        
        await sleep(2000)
        reply("\nmanaged to delete all the trash\n")
    });
}

handler.help = ['rubbish user'];
handler.tags = ['owner'];
handler.command = ["delrubbish", "drubbish"];
handler.owner = true;

module.exports = handler;
