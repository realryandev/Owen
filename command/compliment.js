/*─────────────────────────────────────────
  GitHub  : https://github.com/coderxsa
  YouTube : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q
──────────────────────────────────────────*/

require('../settings/config');

const fetch = require('node-fetch'); // Import node-fetch

let handler = async (m, { client, text, reply }) => {
    try {
        // Use an API to get a compliment.  I'm using a simple public API.
        const apiUrl = 'https://complimentr.com/api/v1/compliment';
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            // Handle HTTP errors (e.g., 500 Internal Server Error)
            return reply(`Failed to fetch compliment: ${response.status} ${response.statusText}`);
        }

        const compliment = data.compliment;

        // Check if the command is used in response to someone
        if (m.quoted) {
            const quotedUser = m.quoted.sender;
            const userName = quotedUser.split('@')[0];
            reply(`@${userName}, ${compliment}`, null, {
                mentions: [quotedUser]
            });
        } else {
            reply(compliment);
        }

    } catch (error) {
        console.error(error);
        reply("An error occurred while fetching the compliment."); // More specific error
    }
};

handler.help = ['compliment'];
handler.tags = ['fun'];
handler.command = ['compliment', 'complimentme'];

module.exports = handler;
