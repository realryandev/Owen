

/*─────────────────────────────────────────
  GitHub   : https://github.com/coderxsa   
  YouTube  : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/       
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q     
──────────────────────────────────────────*/

const { 
  readdirSync,
  statSync,
  unlinkSync
} = require('fs');

const { join } = require('path');

let handler = async (m, { reply, args }) => {
  const sesi = ['./session'];
  const array = [];

  sesi.forEach(dirname => {
    readdirSync(dirname).forEach(file => {
      if (file !== 'creds.json') { 
        array.push(join(dirname, file));
      }
    });
  });

  const deletedFiles = [];

  array.forEach(file => {
    const stats = statSync(file);

    if (stats.isDirectory()) {
      console.log(`skipping directory: ${file}`);
    } else {
      unlinkSync(file);
      deletedFiles.push(file);
    }
  });

  reply('success');

  if (deletedFiles.length > 0) {
    console.log('Deleted files:', deletedFiles);
  }

  if (deletedFiles.length == 0) {
    reply('no files left in session folder');
  }
};

handler.help = ['clearsession'];
handler.tags = ['owner'];
handler.command = ["clears"];
handler.owner = true;

module.exports = handler;
