require("../settings/config");
const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const jimp = require("jimp");
const util = require("util");
const fetch = require("node-fetch");
const moment = require("moment-timezone");
const path = require("path");
const os = require("os");
const { spawn, exec, execSync } = require("child_process");
const { default: baileys, getContentType } = require("@whiskeysockets/baileys");
const { loadMutedGroups } = require("./lib/mutedStore");
const cooldown = require("../cooldowns");

global.mutedGroups = global.mutedGroups || loadMutedGroups();

module.exports = client = async (client, m, chatUpdate, store) => {
  try {
    if (!m) return; // Add this check at the very beginning

    const body =
      m.mtype === "conversation"
        ? m.message?.conversation || "" // Use optional chaining
        : m.mtype === "imageMessage"
          ? m.message?.imageMessage?.caption || ""
          : m.mtype === "videoMessage"
            ? m.message?.videoMessage?.caption || ""
            : m.mtype === "extendedTextMessage"
              ? m.message?.extendedTextMessage?.text || ""
              : m.mtype === "buttonsResponseMessage"
                ? m.message?.buttonsResponseMessage?.selectedButtonId || ""
                : m.mtype === "listResponseMessage"
                  ? m.message?.listResponseMessage?.singleSelectReply
                      ?.selectedRowId || ""
                  : m.mtype === "templateButtonReplyMessage"
                    ? m.message?.templateButtonReplyMessage?.selectedId || ""
                    : m.mtype === "interactiveResponseMessage"
                      ? m.message?.nativeFlowResponseMessage?.paramsJson?.id ||
                        ""
                      : m.mtype === "templateButtonReplyMessage"
                        ? m.msg?.selectedId || ""
                        : m.mtype === "messageContextInfo"
                          ? m.message?.buttonsResponseMessage
                              ?.selectedButtonId ||
                            m.message?.listResponseMessage?.singleSelectReply
                              ?.selectedRowId ||
                            m.text ||
                            ""
                          : "";

    const sender = m.key.fromMe
      ? client.user.id.split(":")[0] + "@s.whatsapp.net" || client.user.id
      : m.key.participant || m.key.remoteJid;

    const senderNumber = sender.split("@")[0];
    const budy = typeof m.text === "string" ? m.text : "";
    const prefa = ["", "!", ".", ",", "🐤", "🗿"];

    const prefixRegex =
      /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
    const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : ".";
    const from = m.key.remoteJid;
    const isGroup = from.endsWith("@g.us");

    const kontributor = JSON.parse(
      fs.readFileSync("./start/lib/database/owner.json")
    );
    const botNumber = await client.decodeJid(client.user.id);
    const Access = [botNumber, ...kontributor, ...global.owner]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);

    const isCmd = body.startsWith(prefix);
    const command = isCmd
      ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
      : "";
    const command2 = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const text = (q = args.join(" "));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const qmsg = quoted.msg || quoted;
    const isMedia = /image|video|sticker|audio/.test(mime);

    let groupMetadata;
    let groupOwner;
    let groupName;
    let participants;
    let groupAdmins;
    let groupMembers;

    if (isGroup) {
      try {
        groupMetadata = await client.groupMetadata(m.chat);
        groupOwner = groupMetadata?.owner || ""; //handle undefined
        groupName = groupMetadata?.subject || "";
        participants = groupMetadata?.participants || [];
        groupAdmins = participants
          .filter((v) => v.admin !== null)
          .map((v) => v.id);
        groupMembers = groupMetadata?.participants || [];
      } catch (e) {
        console.error("Error fetching group metadata:", e);
        // Handle the error appropriately, e.g., assign default values or return.
        groupMetadata = {};
        groupOwner = "";
        groupName = "";
        participants = [];
        groupAdmins = [];
        groupMembers = [];
      }
    } else {
      groupMetadata = {};
      groupOwner = "";
      groupName = "";
      participants = [];
      groupAdmins = [];
      groupMembers = [];
    }
    const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
    const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;

    const { smsg, fetchJson, sleep, formatSize } = require("./lib/myfunction");

    const { remini } = require("./lib/function/remini");

    const cihuy = fs.readFileSync("./start/lib/media/owen.jpg");
    const { fquoted } = require("./lib/fquoted");

    if (m.mtype?.includes("groupStatusMentionMessage") && m.isGroup) {
      // Use optional chaining here as well
      await client.deleteMessage(m.chat, m.key);
    }

    const reaction = async (jidss, emoji) => {
      client.sendMessage(jidss, {
        react: {
          text: emoji,
          key: m.key,
        },
      });
    };

    async function reply(text) {
      client.sendMessage(
        m.chat,
        {
          text: text,
          contextInfo: {
            mentionedJid: [sender],
          },
        },
        { quoted: m }
      );
    }

    const pluginsLoader = async (directory) => {
      let plugins = [];
      try {
        // Add try catch
        const folders = fs.readdirSync(directory);
        folders.forEach((file) => {
          const filePath = path.join(directory, file);
          if (filePath.endsWith(".js")) {
            try {
              const resolvedPath = require.resolve(filePath);
              if (require.cache[resolvedPath]) {
                delete require.cache[resolvedPath];
              }
              const plugin = require(filePath);
              plugins.push(plugin);
            } catch (error) {
              console.log(`${filePath}:`, error);
            }
          }
        });
      } catch (error) {
        console.error("Error loading plugins:", error);
      }
      return plugins;
    };

    const pluginsDisable = true;
    const plugins = await pluginsLoader(path.resolve(__dirname, "../command"));
    const plug = {
      client,
      prefix,
      command,
      reply,
      text,
      Access,
      reaction,
      isGroup: m.isGroup,
      isPrivate: !m.isGroup,
      pushname,
      mime,
      quoted,
      sleep,
      fetchJson,
      sender,
      pushName: pushname,
      args,
    };

    for (let plugin of plugins) {
      if (
        Array.isArray(plugin.command) &&
        plugin.command.includes(command.toLowerCase())
      ) {
        console.log(`Command matched: ${command}`);

        if (plugin.owner && !Access) {
          return reply(mess.owner);
        }

        if (plugin.group && !plug.isGroup) {
          return m.reply(mess.group);
        }

        if (plugin.private && !plug.isPrivate) {
          return m.reply(mess.private);
        }

        // Check for cooldown if plugin.cooldown is defined
        if (plugin.cooldown) {
          const onCooldown = cooldown(plugin.cooldown, plugin.command[0])(
            client,
            m,
            plug.args
          );
          if (onCooldown) return; // Message already sent inside cooldown function
        }

        if (typeof plugin !== "function") return;

        console.log(`Executing plugin: ${plugin.command}`);
        try {
          await plugin(m, plug);
        } catch (error) {
          console.error(`Plugin ${plugin.command} failed:`, error);
        }
        console.log(`Finished plugin: ${plugin.command}`);
      }
    }

    if (!pluginsDisable) return;

    switch (command) {
      case "menu":
        {
          const totalMem = os.totalmem();
          const freeMem = os.freemem();
          const usedMem = totalMem - freeMem;
          const formattedUsedMem = formatSize(usedMem);
          const formattedTotalMem = formatSize(totalMem);
          let mbut = `
┃ 👋 Yo! ${pushname}, Welcome to Owen

information:
 ▢ status: ${client.public ? "public" : "self"}
 ▢ username: @${m.sender.split("@")[0]} 
 ▢ RAM: ${formattedUsedMem} / ${formattedTotalMem}

commands:
> downloader
 ▢ ${prefix}tiktok
 ▢ ${prefix}igdl
 ▢ ${prefix}play

> maker 
 ▢ ${prefix}remini
 ▢ ${prefix}wm
 ▢ ${prefix}brat
 ▢ ${prefix}bratvid
 ▢ ${prefix}qc

> group
 ▢ ${prefix}tagall
 ▢ ${prefix}hidetag

> voice
 ▢ ${prefix}fast
 ▢ ${prefix}tupai
 ▢ ${prefix}blown
 ▢ ${prefix}bass
 ▢ ${prefix}smooth
 ▢ ${prefix}deep
 ▢ ${prefix}earrape 
 ▢ ${prefix}nightcore
 ▢ ${prefix}fat
 ▢ ${prefix}robot
 ▢ ${prefix}slow
 ▢ ${prefix}reverse
 
> Artificial intelligence
 ▢ ${prefix}jeslyn
 ▢ ${prefix}bocchi

> magic
 ▢ ${prefix}mage
 ▢ ${prefix}mbuy
 ▢ ${prefix}minv
 ▢ ${prefix}msell <card>
 ▢ ${prefix}mfight <user>

> pokemon
 ▢ ${prefix}pokemon
 ▢ ${prefix}pcatch
 ▢ ${prefix}pinv
 ▢ ${prefix}psell
 ▢ ${prefix}pfight

> economy
 ▢ ${prefix}give
 ▢ ${prefix}rob
 ▢ ${prefix}robbank
 ▢ ${prefix}steal
 ▢ ${prefix}work
 ▢ ${prefix}hack
 ▢ ${prefix}decrypt
 ▢ ${prefix}mission
 ▢ ${prefix}heist

> gambling
 ▢ ${prefix}slots <amount>

> tools
 ▢ ${prefix}anime
 ▢ ${prefix}movie
 ▢ ${prefix}image
 ▢ ${prefix}define
 ▢ ${prefix}search
 ▢ ${prefix}shorten
 ▢ ${prefix}sticker
 ▢ ${prefix}stake
 ▢ ${prefix}translate
 ▢ ${prefix}voicechanger
 ▢ ${prefix}weather
 ▢ ${prefix}bible
 ▢ ${prefix}ipinfo
 ▢ ${prefix}npm
 ▢ ${prefix}password
 ▢ ${prefix}encode
 ▢ ${prefix}decode
 ▢ ${prefix}directions
 ▢ ${prefix}manga
 ▢ ${prefix}manhwa
 ▢ ${prefix}tovn
 ▢ ${prefix}tts
 ▢ ${prefix}apk

> entertainment
 ▢ ${prefix}beer
 ▢ ${prefix}compliment
 ▢ ${prefix}poll
 ▢ ${prefix}riddle
 ▢ ${prefix}songrecommendation
 ▢ ${prefix}trivia
 ▢ ${prefix}truthordare
 ▢ ${prefix}truth
 ▢ ${prefix}dare
 ▢ ${prefix}answer
 ▢ ${prefix}wouldyourather

> profile
 ▢ ${prefix}claim daily/weekly/monthly/yearly
 ▢ ${prefix}coin
 ▢ ${prefix}lb
 ▢ ${prefix}reset
 ▢ ${prefix}uptime

> owner
 ▢ ${prefix}clears
 ▢ ${prefix}upsw
 ▢ ${prefix}public
 ▢ ${prefix}self
 ▢ ${prefix}get
 ▢ ${prefix}reactch
 ▢ ${prefix}delrubbish
 ▢ ${prefix}listrubbish
 ▢ ${prefix}addcoinuser
 ▢ ${prefix}fixdb
 ▢ ${prefix}kick
 ▢ ${prefix}promote
 ▢ ${prefix}demote
 ▢ ${prefix}server
 ▢ ${prefix}adminlist
 ▢ ${prefix}rubbish

 `;
          client.sendMessage(
            m.chat,
            {
              document: fs.readFileSync("./package.json"),
              fileName: "​RYAN",
              mimetype: "application/pdf",
              fileLength: 99999,
              pageCount: 666,
              caption: mbut,
              contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                mentionedJid: [sender],
                forwardedNewsletterMessageInfo: {
                  newsletterName: "BRUT",
                  newsletterJid: `120363390466661090@newsletter`,
                },
                externalAdReply: {
                  title: "RYAN",
                  body: "This script was created by Ryan",
                  thumbnailUrl: `https://github.com/realryandev`,
                  sourceUrl: "https://realryan.vercel.app/",
                  mediaType: 1,
                  renderLargerThumbnail: true,
                },
              },
            },
            { quoted: m }
          );
        }
        break;

      case "get":
        {
          if (!Access) return reply(mess.owner);
          if (!/^https?:\/\//.test(text))
            return reply(`\n*ex:* ${prefix + command} https://pornhub.com\n`);
          const ajg = await fetch(text);
          await reaction(m.chat, "⚡");

          if (ajg.headers.get("content-length") > 100 * 1024 * 1024) {
            throw `Content-Length: ${ajg.headers.get("content-length")}`;
          }

          const contentType = ajg.headers.get("content-type");
          if (contentType.startsWith("image/")) {
            return client.sendMessage(
              m.chat,
              {
                image: { url: text },
              },
              { quoted: m }
            );
          }

          if (contentType.startsWith("video/")) {
            return client.sendMessage(
              m.chat,
              {
                video: { url: text },
              },
              { quoted: m }
            );
          }

          if (contentType.startsWith("audio/")) {
            return client.sendMessage(
              m.chat,
              {
                audio: { url: text },
                mimetype: "audio/mpeg",
                ptt: true,
              },
              { quoted: m }
            );
          }

          let alak = await ajg.buffer();
          try {
            alak = util.format(JSON.parse(alak + ""));
          } catch (e) {
            alak = alak + "";
          } finally {
            return reply(alak.slice(0, 65536));
          }
        }
        break;

      case "public":
        {
          if (!Access) return reply(mess.owner);
          client.public = true;
          reply(`successfully changed to ${command}`);
        }
        break;

      case "self":
        {
          if (!Access) return reply(mess.owner);
          client.public = false;
          reply(`successfully changed to ${command}`);
        }
        break;

      case "tagall":
        {
          if (!isAdmins) return reply(mess.admin);
          if (!m.isGroup) return reply(mess.group);

          const textMessage = args.join(" ") || "nothing";
          let teks = `tagall message :\n> *${textMessage}*\n\n`;
          const groupMetadata = await client.groupMetadata(m.chat);
          const participants = groupMetadata.participants;
          for (let mem of participants) {
            teks += `@${mem.id.split("@")[0]}\n`;
          }

          client.sendMessage(
            m.chat,
            {
              text: teks,
              mentions: participants.map((a) => a.id),
            },
            { quoted: m }
          );
        }
        break;

      case "h":
      case "hidetag":
        {
          if (!m.isGroup) return reply(mess.group);
          if (!isAdmins && !Access) return reply(mess.admin);
          if (m.quoted) {
            client.sendMessage(m.chat, {
              forward: m.quoted.fakeObj,
              mentions: participants.map((a) => a.id),
            });
          }
          if (!m.quoted) {
            client.sendMessage(
              m.chat,
              {
                text: q ? q : "",
                mentions: participants.map((a) => a.id),
              },
              { quoted: m }
            );
          }
        }
        break;

      case "enhancer":
      case "unblur":
      case "enhance":
      case "hdr":
      case "hd":
      case "remini":
        {
          client.enhancer = client.enhancer ? client.enhancer : {};
          if (m.sender in client.enhancer)
            return reply(
              `\nThere is still a process that has not been completed, please be patient\n`
            );
          let q = m.quoted ? m.quoted : m;
          let mime = (q.msg || q).mimetype || q.mediaType || "";
          if (!mime)
            return reply(
              `\nimage reply, with the caption ${prefix + command}\n`
            );
          if (!/image\/(jpe?g|png)/.test(mime))
            return reply(`mime ${mime} not supported`);
          else client.enhancer[m.sender] = true;
          await reaction(m.chat, "⚡");
          let img = await q.download?.();
          let error;
          try {
            const This = await remini(img, "enhance");
            await reaction(m.chat, "⚡");
            client.sendFile(m.chat, This, "", "```success...```", m);
          } catch (er) {
            error = true;
          } finally {
            if (error) {
              reply(m.chat, "process failed :(", m);
            }
            delete client.enhancer[m.sender];
          }
        }
        break;

      case "swm":
      case "wm":
      case "stickerwm":
      case "take":
        {
          if (!args.join(" "))
            return reply(`\n*ex:* ${prefix + command} coderxsa\n`);
          const swn = args.join(" ");
          const pcknm = swn.split("|")[0];
          const atnm = swn.split("|")[1];
          if (m.quoted?.isAnimated === true) {
            // Use optional chaining
            client.downloadAndSaveMediaMessage(quoted, "gifee");
            client.sendMessage(
              m.chat,
              {
                sticker: fs.readFileSync("gifee.webp"),
              },
              m,
              {
                packname: pcknm,
                author: atnm,
              }
            );
          } else if (/image/.test(mime)) {
            let media = await quoted.download();
            let encmedia = await client.sendImageAsSticker(m.chat, media, m, {
              packname: pcknm,
              author: atnm,
            });
          } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 10)
              return reply("\nmaximum duration 10 seconds\n");
            let media = await quoted.download();
            let encmedia = await client.sendVideoAsSticker(m.chat, media, m, {
              packname: pcknm,
              author: atnm,
            });
          } else {
            reply(`\n*ex:* reply image/video ${prefix + command}\n`);
          }
        }
        break;

      case "reactch":
        {
          if (!Access) return reply(mess.owner);
          if (!text)
            return reply(
              `\n*ex:* ${prefix + command} https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q  😂😂😂😂\n`
            );
          const match = text.match(
            /https:\/\/whatsapp\.com\/channel\/(\w+)(?:\/(\d+))?/
          );
          if (!match) return reply("Invalid URL. Please check again..");
          const channelId = match[1];
          const chatId = match[2];
          if (!chatId) return reply("Chat ID not found in the link provided.");
          client.newsletterMetadata("invite", channelId).then((data) => {
            if (!data) return reply("not found or an error occurred.");
            client.newsletterReactMessage(
              data.id,
              chatId,
              text.split(" ").slice(1).join(" ") || "😀"
            );
          });
        }
        break;

      default:
        if (budy.startsWith("/")) {
          if (!Access) return;
          exec(budy.slice(2), (err, stdout) => {
            if (err) return reply(err);
            if (stdout) return reply("\n" + stdout);
          });
        }

        if (budy.startsWith("*")) {
          if (!Access) return;
          try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
            await m.reply(evaled);
          } catch (err) {
            m.reply(String(err));
          }
        }

        if (budy.startsWith("-")) {
          if (!Access) return;
          let kode = budy.trim().split(/ +/)[0];
          let teks;
          try {
            teks = await eval(
              `(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`
            );
          } catch (e) {
            teks = e;
          } finally {
            await m.reply(require("util").format(teks));
          }
        }
    }
  } catch (err) {
    console.error("Main error handler:", err);
    //  if (m) { // check if m is defined
    //    await m.reply("An unexpected error occurred. Please try again later.");
    //  }
  }
};

let file = require.resolve(__filename);
require("fs").watchFile(file, () => {
  require("fs").unwatchFile(file);
  console.log("\x1b[0;32m" + __filename + " \x1b[1;32mupdated!\x1b[0m");
  delete require.cache[file];
  require(file);
});
