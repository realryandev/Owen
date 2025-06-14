/*─────────────────────────────────────────
  GitHub  : https://github.com/coderxsa
  YouTube : https://youtube.com/@coderxsa
  Rest API : https://coderx-api.onrender.com/
  Channel  : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q
──────────────────────────────────────────*/

require('../settings/config'); // Assuming this file exists and sets up necessary variables
const fs = require('fs'); // Not used in this version, but kept for consistency

let handler = async (m, { client, text, reply, quoted, mime, prefix, command }) => {
    try {
        const responses = [
            "┃ Would you rather have unlimited energy but be unable to feel physical pleasure, or have amazing sex but always feel tired?",
            "┃ Would you rather be the most famous person in the world but be universally hated, or be a completely unknown person but be loved by everyone you meet?",
            "┃ Would you rather lose the ability to read or lose the ability to speak?",
            "┃ Would you rather have a rewind button or a pause button on your life?",
            "┃ Would you rather always be slightly too warm or always be slightly too cold?",
            "┃ Would you rather have a horrible short-term memory (like 10 seconds) or a horrible long-term memory (only remember the last day)?",
            "┃ Would you rather be able to fly but not be able to control where you go, or be invisible but only when no one is looking for you?",
            "┃ Would you rather have a third arm or a third leg?",
            "┃ Would you rather be the smartest person in the world but everyone thinks you're an idiot, or be an average intelligence person but everyone thinks you're a genius?",
            "┃ Would you rather always say everything on your mind or never be able to speak again?",
            "┃ Would you rather live for a thousand years but never leave Earth, or travel to any planet you want but only live to be 80?",
            "┃ Would you rather be able to talk to animals but they can't understand you, or be able to understand animals but not be able to talk to them?",
            "┃ Would you rather have a beautiful singing voice but only be able to sing one song, or be able to play every musical instrument but sound average at all of them?",
            "┃ Would you rather have all of your dreams and thoughts broadcast to the world, or never be able to dream again?",
            "┃ Would you rather find true love but lose all your money, or become incredibly wealthy but never experience true love?",
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Use a consistent reply function
        reply(`\n┃ *Would You Rather?*\n\n${randomResponse}`);

    } catch (error) {
        console.error(error);
        reply('An error occurred.'); // Improved error message
    }
};

handler.help = ['wouldyourather'];
handler.tags = ['fun']; // Changed tag to 'fun' - more appropriate
handler.command = ['wouldyourather', 'wyr']; // Added 'wyr' as an alias

module.exports = handler;
