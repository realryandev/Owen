require("../settings/config");

let handler = async (
  m,
  { client, args, isGroup, isBotGroupAdmins, Access, reply, quoted }
) => {
  try {
    if (!isGroup) {
      return reply("❌ ┃ *This command can only be used in groups.*");
    }

    if (!Access) {
      return reply("🚫 ┃ *Only the owner can use this command.*");
    }

    if (!isBotGroupAdmins) {
      return reply("🤖 ┃ *I must be an admin to add members.*");
    }

    let userToAdd;

    if (quoted) {
      userToAdd = quoted.sender;
    } else if (args.length > 0) {
      let num = args[0].replace(/\D/g, ""); // Keep digits only
      if (num.length < 8 || num.length > 15) {
        return reply("⚠️┃ *Please provide a valid phone number.*");
      }
      userToAdd = num + "@s.whatsapp.net";
    } else {
      return reply(
        "❗┃ *Please reply to a message, mention a user, or provide a phone number to add.*"
      );
    }

    const botNumber = client.user.id.split(":")[0] + "@s.whatsapp.net";
    if (userToAdd === botNumber) {
      return reply("🤖┃ *I am already in the group.*");
    }

    // Attempt to add
    const response = await client.groupParticipantsUpdate(
      m.chat,
      [userToAdd],
      "add"
    );

    if (response[0]?.status === 403) {
      return reply(
        "🔒┃ *Cannot add this user. They may have group privacy settings on.*"
      );
    }

    if (response[0]?.status >= 400) {
      return reply(
        "❌┃ *Failed to add. Make sure the number is correct and the user is on WhatsApp.*"
      );
    }

    await reply(
      `✅┃ *Successfully added ${userToAdd.replace(/@s\.whatsapp\.net$/, "")} to the group.*`
    );
  } catch (error) {
    console.error("Add Command Error:", error);
    await reply("⚠️┃ *Failed to add user to the group. Please try again.*");
  }
};

handler.help = ["add"];
handler.tags = ["owner"];
handler.command = ["add"];
handler.group = true; // Group only
handler.owner = true; // Owner only

module.exports = handler;
