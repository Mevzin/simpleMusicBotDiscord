require("dotenv").config();
const { Client, EmbedBuilder } = require("discord.js");
const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates", "MessageContent"],
});
const { DisTube } = require("distube");

let currentSound = null;

client.DisTube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
});

client.on("ready", (client) => {
  console.log("Bot ready!");
});

client.on("messageCreate", (message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = "?";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const argsFormatted = args.shift().toLowerCase();

  if (!message.content.toLowerCase().startsWith(prefix)) return;

  if (argsFormatted === "play" || argsFormatted === "p") {
    client.DisTube.play(message.member.voice.channel, args.join(" "), {
      member: message.member,
      textChannel: message.channel,
      message,
    });
    const resumeEmbed = new EmbedBuilder()
      .setColor("#1974D2")
      .setTitle("Pesquisando a música pedida!")
      .addFields({
        name: "Só um segundo, estou procurando sua musica nessa bagunça 😅",
        value: "Tempo médio de: 3 segundos",
        inline: true,
      })
      .setTimestamp();
    message.reply({ embeds: [resumeEmbed] });
    message.react("🔍");
  }

  if (argsFormatted === "skip") {
    client.DisTube.skip(message);
    message.react("✅");
  }

  if (argsFormatted === "pause") {
    client.DisTube.pause(message);
    const pausedEmbed = new EmbedBuilder()
      .setColor("#CC3333")
      .setTitle("Musica pausada!")
      .setThumbnail(currentSound.thumbnail)
      .addFields({
        name: currentSound.name,
        value:
          `Duração: ${currentSound.formattedDuration} \n` +
          `Url: ${currentSound.url} \n` +
          `Views: ${currentSound.views} \n`,
        inline: true,
      })
      .setTimestamp();
    message.reply({ embeds: [pausedEmbed] });
    message.react("⏸");
  }

  if (argsFormatted === "resume") {
    client.DisTube.resume(message);
    const resumeEmbed = new EmbedBuilder()
      .setColor("#0EF907")
      .setTitle("Continuando")
      .setThumbnail(currentSound.thumbnail)
      .addFields({
        name: currentSound.name,
        value:
          `Duração: ${currentSound.formattedDuration} \n` +
          `Url: ${currentSound.url} \n` +
          `Views: ${currentSound.views} \n`,
        inline: true,
      })
      .setTimestamp();
    message.reply({ embeds: [resumeEmbed] });
    message.react("⏯");
  }

  client.DisTube.on("playSong", (queue, song) => {
    currentSound = song;
    const successEmbed = new EmbedBuilder()
      .setColor("#0EF907")
      .setTitle("Tocando agora!")
      .setThumbnail(song.thumbnail)
      .addFields({
        name: song.name,
        value:
          `Duração: ${song.formattedDuration} \n` +
          `Url: ${song.url} \n` +
          `Views: ${song.views} \n`,
        inline: true,
      })
      .setTimestamp();
    queue.textChannel.send({ embeds: [successEmbed] });
  });
});

client.login(process.env.TOKEN);
