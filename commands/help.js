const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType } = require("discord.js");
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

const embed = new EmbedBuilder()
.setTitle(`Commandes de ${client.user.username}`)
.setColor('#2F3136')
.setDescription('**Veuillez sélectionner une catégorie pour afficher toutes ses commandes**')
.addFields({ name: `Liens :`, value: `- [Chaîne Youtube]()\n- [Serveur Discord]()\n- [GitHub](https://github.com/RushDicapRio)`, inline: true })
.setTimestamp()
.setFooter({
  text: `Depmandé par ${message.author.username} | ` + config.copyright, 
  iconURL: message.author.displayAvatarURL()
});

  const giveaway = new EmbedBuilder()
  .setTitle("Catégories » Giveaway")
  .setColor('#2F3136')
  .setDescription("```yaml\nVoici les commandes gratuites :```")
  .addFields(
    { name: 'Create / Start'  , value: `Commencez un giveaway dans votre serveur !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Drop' , value: `Commencer un drop de giveaway !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Edit' , value: `Modifier un giveaway déjà en cours !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'End' , value: `Mettre fin à un giveaway déjà en cours !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'List' , value: `Répertorier tous les giveaways en cours d'exécution au sein de ce serveur !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Pause' , value: `Pause an already running giveaway!\n > **Type: __\`slash\`__**`, inline: true },
    { name: 'Reroll' , value: `Relancer un giveaway terminé !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Resume' , value: `Reprendre un giveaway interrompu !\n > **Type: __\`slash\`__**`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Demandé par ${message.author.username} | ` + config.copyright, 
    iconURL: message.author.displayAvatarURL()
  });

  const general = new EmbedBuilder()
  .setTitle("Catégories » Général")
  .setColor('#2F3136')
  .setDescription("```yaml\nVoici les commandes générales du bot :```")
  .addFields(
    { name: 'Help'  , value: `Affiche toutes les commandes disponibles pour ce bot !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Invite' , value: `Obtenir le lien d'invitation du bot !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
    { name: 'Ping' , value: `Vérifier la latence du websocket du bot !\n > **Types: __\`slash\` / \`message\`__**`, inline: true },
  )
  .setTimestamp()
  .setFooter({
    text: `Deamandé par  ${message.author.username} | ` + config.copyright, 
    iconURL: message.author.displayAvatarURL()
  });
  
  const components = (state) => [
    new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
        .setCustomId("help-menu")
        .setPlaceholder("Veuillez sélectionner une catégorie")
        .setDisabled(state)
        .addOptions([{
                label: `Giveaways`,
                value: `giveaway`,
                description: `Voir toutes les commandes basées sur les giveaways !`,
                emoji: `🎉`
            },
            {
                label: `Général`,
                value: `general`,
                description: `Afficher toutes les commandes générales du bot !`,
                emoji: `⚙`
            }
        ])
    ),
];

const initialMessage = await message.reply({ embeds: [embed], components: components(false) });

const filter = (interaction) => interaction.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector(
            {
                filter,
                componentType: ComponentType.SelectMenu,
                idle: 300000,
                dispose: true,
            });

        collector.on('collect', (interaction) => {
            if (interaction.values[0] === "giveaway") {
                interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => {});
            } else if (interaction.values[0] === "general") {
                interaction.update({ embeds: [general], components: components(false) }).catch((e) => {});
            }
        });
        collector.on("end", (collected, reason) => {
            if (reason == "time") {
                initialMessage.edit({
                   content: "Collecteur détruit, réessayez !",
                   components: [],
                });
             }
        });
}