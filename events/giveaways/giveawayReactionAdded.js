const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved =  new Discord.EmbedBuilder()
    .setTimestamp()
    .setColor("#2F3136")
    .setTitle("Entrée approuvée ! | Vous avez une chance de gagner !!")
    .setDescription(
      `Votre entrée à [Le Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) a été approuvé !`
    )
    .setFooter({ text: "Abonnez vous à mon GitHuB !" })
    .setTimestamp()
   let denied =  new Discord.EmbedBuilder()
    .setTimestamp()
    .setColor("#2F3136")
    .setTitle(":x: Entrée refusée | Entrée de base de données introuvable et renvoyée !")
    .setDescription(
      `Votre entrée à [Le Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) a été refusé, veuillez vérifier correctement les conditions requises pour le giveaway.`
    )
    .setFooter({ text: "Abonnez vous à mon GitHuB !" })

    let client = messageReaction.message.client
    if (reactor.user.bot) return;
    if(giveaway.extraData) {
      if (giveaway.extraData.server !== "null") {
        try { 
        await client.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
        return reactor.send({
          embeds: [approved]
        });
        } catch(e) {
          messageReaction.users.remove(reactor.user);
          return reactor.send({
            embeds: [denied]
          }).catch(e => {})
        }
      }
      if (giveaway.extraData.role !== "null" && !reactor.roles.cache.get(giveaway.extraData.role)){ 
        messageReaction.users.remove(reactor.user);
        return reactor.send({
          embeds: [denied]
        }).catch(e => {})
      }

      return reactor.send({
        embeds: [approved]
      }).catch(e => {})
    } else {
        return reactor.send({
          embeds: [approved]
        }).catch(e => {})
    }
    }
  }