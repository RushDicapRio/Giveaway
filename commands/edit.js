module.exports.run = async (client, message) => {
    const Discord = require("discord.js");
    const ms = require("ms");
    let time = "";
    let winnersCount;
    let prize = "";
    let giveawayx = "";
    let embed = new Discord.EmbedBuilder()
      .setTitle("Edité un Giveaway !")
      .setColor('#2F3136')
      .setFooter({ 
        text: `${client.user.username}`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();
    const msg = await message.reply({
      embeds:
        [embed.setDescription(
          "Quel giveaway souhaitez-vous modifier ?\nFournissez l'ID du message du diveaway\n **Doit répondre dans les 30 secondes !**"
        )]
    }
    );
    let xembed = new Discord.EmbedBuilder()
      .setTitle("Oops ! On dirait que nous avons rencontré un délai d'attente ! 🕖")
      .setColor("#FF0000")
      .setDescription('💥 Tentez votre chance !\nVous avez mis trop de temps à décider !\nUtilisez à nouveau ``modifier`` pour modifier un giveaway !\nEssayez de répondre dans les **30 secondes** cette fois !')
      .setFooter({ 
        text: `${client.user.username}`, 
        iconURL: client.user.displayAvatarURL() 
      })
      .setTimestamp();
  
    const filter = m => m.author.id === message.author.id && !m.author.bot;
    const collector = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000
    });
  
    collector.on("collect", async collect => {
  
      const response = collect.content;
      let gid = response;
      // vérifier si l'ID est valide

      
      await collect.delete()
        if (!client.giveawaysManager.giveaways.find((g) => g.messageID === gid)) {
           return msg.edit({
                embeds: [
                  embed.setDescription(
                    "Oh-Oh ! Il semble que vous ayez fourni un ID de message non valide !\n**Réessayer ?**\n Exemple : ``677813783523098627``"
                  )]
              }
              );
        }
      else {
        collector.stop(
          msg.edit({
            embeds: [
              embed.setDescription(
                `Bien ! Ensuite, quelle serait notre nouvelle heure pour que le giveaway se termine \n** Doit répondre dans les 30 secondes !**`
              )]
          }
          )
        );
      }
      const collector2 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000
      });
      collector2.on("collect", async collect2 => {
  
        let mss = ms(collect2.content);
        await collect2.delete()
        if (!mss) {
          return msg.edit({
            embeds: [
              embed.setDescription(
                "Ah zut ! Il semble que vous m'ayez fourni une durée non valide\n**Réessayer ?**\n Exemple : ``-10 minutes``,``-10m``,``-10``\n **Remarque : - (moins) Indique que vous souhaitez réduire le temps !**"
              )]
          }
          );
        } else {
          time = mss;
          collector2.stop(
            msg.edit({
              embeds: [
                embed.setDescription(
                  `Bien ! Ensuite, combien de gagnants dois-je lancer pour le giveaway maintenant ?\n**Doit répondre dans les 30 secondes.**`
                )]
            }
            )
          );
        }
        const collector3 = await message.channel.createMessageCollector(filter, {
          max: 3,
          time: 30000,
          errors: ['time']
        });
        collector3.on("collect", async collect3 => {
  
          const response3 = collect3.content.toLowerCase();
          await collect3.delete()
          if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
            return msg.edit({
              embeds: [
                embed.setDescription(
                  "Boi ! Les gagnants doivent être un nombre ou supérieur à 1 !\n**Réessayer ?**\n Exemple ``1``,``10``, etc."
                )]
            }
            );
          } else {
            winnersCount = parseInt(response3);
            collector3.stop(
              msg.edit({
                embeds: [
                  embed.setDescription(
                    `D'accord, humain généreux ! Ensuite, quel devrait être le nouveau prix pour le giveaway ?\n**Doit répondre dans les 30 secondes !**`
                  )]
              })
            )
          }
          const collector4 = await message.channel.createMessageCollector(filter, {
          max: 3,
          time: 30000,
          errors: ['time']
        });
          collector4.on("collect", async collect4 => {
  
            const response4 = collect4.content.toLowerCase();
            prize = response4;
            await collect4.delete()
            collector4.stop(
              console.log(giveawayx),
              msg.edit({
                embeds: [
                  embed.setDescription(
                    `Edité`
                  )]
              }
              )
            );
            client.giveawaysManager.edit(gid, {
              newWinnerCount: winnersCount,
              newPrize: prize,
              addTime: time
            })
          });
        });
      });
    });
    collector.on('end', (collected, reason) => {
      if (reason == 'time') {
        message.reply({ embeds: [xembed] });
      }
    })
    try {
      collector2.on('end', (collected, reason) => {
        if (reason == 'time') {
  
          message.reply({ embeds: [xembed] });
        }
      });
      collector3.on('end', (collected, reason) => {
        if (reason == 'time') {
          message.reply({ embeds: [xembed] });
  
        }
      })
      collector4.on('end', (collected, reason) => {
        if (reason == 'time') {
  
          message.reply({ embeds: [xembed] });
        }
      })
    } catch (e) { }
  }