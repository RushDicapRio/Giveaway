const Discord = require('discord.js');
module.exports = {
  async execute(giveaway, member, reaction) {
    reaction.users.remove(member.user);
    member.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle(`Le giveaway est déjà terminé !`)
            .setColor('#b50505')
            .setDescription(
              `Hé ${member.user} **[[Le Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** à laquelle vous avez réagi est déjà terminé :sob:\nSoyez rapide la prochaine fois !`
            )
            .setTimestamp(),
        ],
      })
      .catch((e) => {});
  },
};