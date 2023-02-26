const Discord = require("discord.js")
const {  ApplicationCommandOptionType } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms")
module.exports = {
  name: 'start',
  description: '🎉 Lancer un giveaway',

  options: [
    {
      name: 'duration',
      description: 'Combien de temps le giveaway devrait durer. Exemples de valeurs : 1m, 1h, 1d',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'winners',
      description: 'Combien de gagnants le giveaway devrait avoir',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
      name: 'prize',
      description: 'Quel devrait être le prix du giveaway',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'channel',
      description: 'La chaîne pour commencer le giveaway dans',
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
      name: 'bonusrole',
      description: 'Rôle qui recevrait des entrées bonus',
      type: ApplicationCommandOptionType.Role,
      required: false
    },
    {
      name: 'bonusamount',
      description: "Le nombre d'entrées bonus que le rôle recevra",
      type: ApplicationCommandOptionType.Integer,
      required: false
    },
    {
      name: 'invite',
      description: 'Invitation du serveur que vous souhaitez ajouter comme condition de participation gratuite',
      type: ApplicationCommandOptionType.String,
      required: false
    },
    {
      name: 'role',
      description: "Rôle que vous souhaitez ajouter comme condition d'adhésion gratuite",
      type: ApplicationCommandOptionType.Role,
      required: false
    },
  ],

  run: async (client, interaction) => {

    // Si le membre n'a pas assez d'autorisations
    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Vous devez disposer des autorisations de gestion des messages pour lancer des giveaways.',
        ephemeral: true
      });
    }

    const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');

    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ':x: Veuillez sélectionner un salon textuel !',
        ephemeral: true
      });
    }
   if(isNaN(ms(giveawayDuration))) {
    return interaction.reply({
      content: ':x: Veuillez sélectionner une durée valide !',
      ephemeral: true
    });
  }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Veuillez sélectionner un nombre valide de gagnants ! supérieur ou égal à 1.',
      })
    }

    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: Vous devez spécifier le nombre d'entrées bonus que ${bonusRole} recevrait !`,
          ephemeral: true
        });
      }
    }


    await interaction.deferReply({ ephemeral: true })
    let reqinvite;
    if (invite) {
      let invitex = await client.fetchInvite(invite)
      let client_is_in_server = client.guilds.cache.get(
        invitex.guild.id
      )
      reqinvite = invitex
      if (!client_is_in_server) {
          const gaEmbed = {
            author: {
              name: client.user.username,
              iconURL: client.user.displayAvatarURL() 
            },
            title: "Vérification du serveur !",
            url: "https://https://github.com/RushDicapRio",
            description:
              "Ouah ouah ouah ! Je vois un nouveau serveur ! es-tu sûr que je suis dedans ? Vous devez m'inviter là-bas pour définir cela comme une exigence ! 😳",
            timestamp: new Date(),
            footer: {
              iconURL: client.user.displayAvatarURL(),
              text: "Vérification du serveur"
            }
          }  
        return interaction.editReply({ embeds: [gaEmbed]})
      }
    }

    if (rolereq && !invite) {
      messages.inviteToParticipate = `**Réagissez avec 🎉 pour participer !**\n>>> - Seuls les membres ayant ${rolereq} sont autorisés à participer à ce giveaway !`
    }
    if (rolereq && invite) {
      messages.inviteToParticipate = `**Réagissez avec 🎉 pour participer !**\n>>> - Seuls les membres ayant ${rolereq} sont autorisés à participer à ce giveaway !\n- Les membres doivent rejoindre [ce serveur](${invite}) pour participer à ce giveaway !`
    }
    if (!rolereq && invite) {
      messages.inviteToParticipate = `**Réagissez avec 🎉 pour participer !**\n>>> - Les membres doivent rejoindre [ce serveur](${invite}) pour participer à ce giveaway !`
    }


    // lancé le giveaway
    client.giveawaysManager.start(giveawayChannel, {
      // La durée du giveaway
      duration: ms(giveawayDuration),
      // Le prix à gagné
      prize: giveawayPrize,
      // Le nombre de gagnant(s)
      winnerCount: parseInt(giveawayWinnerCount),
      // Hébergé par
      hostedBy: client.config.hostedBy ? interaction.user : null,
      // Entrées bonus si fournies
      bonusEntries: [
        {
          // Les membres qui ont le rôle qui est attribué à "rolename" obtiennent le nombre d'entrées bonus qui sont attribuées à "BonusEntries"
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Le giveaway a commencé dans ${giveawayChannel}!`,
      ephemeral: true
    })

    if (bonusRole) {
      let giveaway = new Discord.EmbedBuilder()
        .setAuthor({ name: `Alerte d'entrées bonus !` })
        .setDescription(
          `**${bonusRole}** A **${bonusEntries}** entrées supplémentaires dans ce giveaway !`
        )
        .setColor("#2F3136")
        .setTimestamp();
      giveawayChannel.send({ embeds: [giveaway] });
    }
  }
};