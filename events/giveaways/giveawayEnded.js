const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 Allons-y !`)
          .setColor("#2F3136")
          .setDescription(`Bonjour ${member.user}\n J'ai entendu dire que vous aviez gagné **[[Le Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n Bravo pour avoir gagné **${giveaway.prize} !**\nEnvoyez un message direct à l'hôte pour réclamer votre prix !!`)
          .setTimestamp()
          .setFooter({
            text: `${member.user.username}`, 
            iconURL: member.user.displayAvatarURL()
           })
        ]
      }).catch(e => {})
    });
  }
}