const { ApplicationCommandOptionType } = require('discord.js');
const ms = require("ms");

module.exports = {
  name: 'edit',
  description: '🎉 Modifier un giveaway',

  options: [
    {
      name: 'giveaway',
      description: 'Le giveaway à la fin (message ID)',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'duration',
      description: "Heure de réglage du giveaway mentionné. Par exemple. 1h définit le cadeau actuel pour qu'il se termine après une heure !",
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
    }
  ],

  run: async (client, interaction) => {

    // Si le membre n'a pas assez d'autorisations
    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: Vous devez disposer des autorisations de gestion des messages pour lancer des giveaways.',
        ephemeral: true
      });
    }
    const gid = interaction.options.getString('giveaway');
    const time = interaction.options.getString('duration');
    const winnersCount = interaction.options.getInteger('winners');
    const prize = interaction.options.getString('prize');
    let duration;
    if (time.startsWith("-")) {
      duration = -ms(time.substring(1));
    } else {
      duration = ms(time);
    }

    if (isNaN(duration)) {
      return interaction.reply({
        content: ":x: Veuillez sélectionner une durée valide !",
        ephemeral: true,
      });
    }
    await interaction.deferReply({
      ephemeral: true
    })
    // Edité le giveaway
    try {
      await client.giveawaysManager.edit(gid, {
        newWinnerCount: winnersCount,
        newPrize: prize,
        addTime: time
      })
    } catch (e) {
      return interaction.editReply({
        content:
          `Aucun giveaway trouvé avec l'ID de message donné : \`${gid}\``,
        ephemeral: true
      });
    }
    interaction.editReply({
      content:
        `Ce giveaway a maintenant été modifié !`,
      ephemeral: true
    });
  }
};