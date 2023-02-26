const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "resume",
    description: '▶ Reprendre un giveaway interrompu',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway à reprendre (message ID ou prix du giveaway)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Si le membre n'a pas assez d'autorisations
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ':x: Vous devez disposer des autorisations de gestion des messages pour suspendre les giveaways.',
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // essayez de trouver le giveaway avec le prix ou avec l'ID
        const giveaway =
            // Recherche le prix du giveaway
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // recherche l'ID du giveaway
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // Si aucun giveaway n'a été trouvé
        if (!giveaway) {
            return interaction.reply({
                content: 'Impossible de trouver un giveaway pour `' + query + '`.',
                ephemeral: true
            });
        }

        if (!giveaway.pauseOptions.isPaused) {
            return interaction.reply({
                content: `**[Le giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  n'est pas en pause !`,
                ephemeral: true
            });
        }

        // Modifier le giveaway
        client.giveawaysManager.unpause(giveaway.messageId)
            // Message de réussite
            .then(() => {
                // Message de réussite
                interaction.reply(`**[Le giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** a été repris avec succès !`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
    }
};