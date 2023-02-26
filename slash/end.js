const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "end",
    description: '🎉 Mettre fin à un giveaway déjà en cours',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway à la fin (message ID ou le pris à gagné)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Si le membre n'a pas assez d'autorisations
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Vous devez disposer des autorisations de gestion des messages pour mettre fin aux giveaways.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // récupérer le giveaway avec un identifiant de message ou un prix
        const giveaway =
            // recherche via le prix du giveaway
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // recherche via l'ID du giveaway
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // Si aucun giveaway n'a été trouvé avec l'entrée correspondante
        if (!giveaway) {
            return interaction.reply({
                content: 'Impossible de trouver un giveaway pour `' + query + '`.',
                ephemeral: true
            });
        }

        if (giveaway.ended) {
            return interaction.reply({
                content: 'Ce giveaway est déjà terminé !',
                ephemeral: true
            });
        }

        // Edité le giveaway
        client.giveawaysManager.end(giveaway.messageId)
            // Message de réussite
            .then(() => {
                // Message de réussite
                interaction.reply(`**[Le Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** est maintenant terminé !`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
    }
};
