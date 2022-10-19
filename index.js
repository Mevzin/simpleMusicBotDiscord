require("dotenv").config();
const discord = require('discord.js');
const client = new discord.Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildVoiceStates",
    "MessageContent"
  ]
});
const { DisTube } = require('distube');

client.DisTube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false
})

client.on("ready", client => {
  console.log("Bot ready!");
});

client.on("messageCreate", message => {
  if(message.author.bot || !message.guild) return;
  const prefix = "?";
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  
  if(!message.content.toLowerCase().startsWith(prefix)) return;
  
  if(args.shift().toLowerCase() === "play"){
    console.log(message)
    client.DisTube.play(message.member.voice.channel, args.join(" "),{
      member: message.member,
      textChannel: message.channel,
      message
    })
  }
});

client.DisTube.on("playSong", (queue, song) => {
  queue.textChannel.send("Tocando agora: " + song.name)
})

client.login(process.env.TOKEN);