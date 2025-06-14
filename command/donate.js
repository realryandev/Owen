let handler = async (m, { reply }) => {
    reply("🙏 Support us by donating: https://pay.yoco.com/ShopZa");
}

handler.help = ['donate'];
handler.tags = ['info'];
handler.command = ["donate"];

module.exports = handler;