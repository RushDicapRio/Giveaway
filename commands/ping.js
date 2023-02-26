const Discord = require('discord.js');
const config = require('../config.json');
module.exports.run = async (client, message, args) => {
  let m = await message.reply("Sending request to websocket...")
  let pong = new Discord.EmbedBuilder()
    .setAuthor({
      name: `🏓 Pong !`, 
      iconURL: message.author.displayAvatarURL()
    })
    .setTitle("Ping du Bot")
    .setColor('#2F3136')	
    .setTimestamp()
                 
    .addFields([
   { name: '**Latence**', value: `\`${Date.now() - message.createdTimestamp}ms\`` },
   { name: "**Latence de l'API**", value: `\`${Math.round(client.ws.ping)}ms\`` },
    ])
    .setFooter({
      text: `Demandé par ${message.author.tag}`, 
      iconURL: message.author.displayAvatarURL()
    });

     m.delete()
  message.reply({ content: " ", embeds: [pong] })
}