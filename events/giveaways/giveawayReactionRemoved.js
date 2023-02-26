const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, member) {
    return member.send({
      embeds: [new Discord.EmbedBuilder()
        .setTimestamp()
        .setTitle("❓ Attendez-vous juste de supprimer une réaction d'un giveaway ?")
        .setColor("#2F3136")
        .setDescription(
          `Votre entrée à [Le Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) a été enregistré mais vous n'avez pas réagi, puisque vous n'avez pas besoin de **${giveaway.prize}** je devrais choisir quelqu'un d'autre 😭`
        )
        .setFooter({ text: "Vous pensez que c'était une erreur ? Allez réagir à nouveau !" })
      ]
    }).catch(e => {})
  }
}