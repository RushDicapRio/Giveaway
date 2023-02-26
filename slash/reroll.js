const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "reroll",
    description: '🎉 Relancer un giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'Le giveaway à relancer (message ID ou prix)',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    run: async (client, interaction) => {

        // Si le membre n'a pas assez d'autorisations
        if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
            return interaction.reply({
                content: ":x: Vous devez avoir l'autorisation de gérer les messages pour relancer les giveaways.",
                ephemeral: true
            });
        }

        const query = interaction.options.getString('giveaway');

        // essayez de trouver le giveaway avec le prix fourni OU avec l'ID
        const giveaway =
            // Recherche le giveaway avec le pris à gagné
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Rechercher avec l'identifiant du giveaway
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // Si aucun giveaway n'a été trouvé
        if (!giveaway) {
            return interaction.reply({
                content: 'Impossible de trouver un giveaway pour `' + query + '`.',
                ephemeral: true
            });
        }

        if (!giveaway.ended) {
            return interaction.reply({
                content: `[Le Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) n'est pas encore terminé`,
                ephemeral: true
            });
        }

        // Relancé le giveaway
        client.giveawaysManager.reroll(giveaway.messageId)
            .then(() => {
                // Message de réussite
                interaction.reply(`Relancé **[le giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) !**`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
    }
};