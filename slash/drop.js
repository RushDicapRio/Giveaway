const messages = require("../utils/message");
const {  ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'drop',
    description: 'Créer un drop de giveaway',
    options: [
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
        }
    ],

    run: async (client, interaction) => {

        // Si le membre n'a pas assez d'autorisations
        if(!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")){
            return interaction.reply({
                content: ':x: Vous devez disposer des autorisations de gestion des messages pour lancer des giveaways.',
                ephemeral: true
            });
        }

        const giveawayChannel = interaction.options.getChannel('channel');
        const giveawayWinnerCount = interaction.options.getInteger('winners');
        const giveawayPrize = interaction.options.getString('prize');
      
    if (!giveawayChannel.isTextBased()) {
      return interaction.reply({
        content: ':x: Veuillez sélectionner un salon textuel !',
        ephemeral: true
      });
    }   
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content: ':x: Veuillez sélectionner un nombre valide de gagnants ! supérieur ou égal à 1.',
      })
    }

        // Lance le giveaway
        client.giveawaysManager.start(giveawayChannel, {
            // Le nombre de gagnants pour ce drop
            winnerCount: giveawayWinnerCount,
            // Le prix du giveaway
            prize: giveawayPrize,
            // Qui héberge ce giveaway
            hostedBy: client.config.hostedBy ? interaction.user : null,
            // spécifier le drop
            isDrop: true,
            // Messages
            messages
        });

        interaction.reply(`Giveaway started in ${giveawayChannel}!`);

    }
};