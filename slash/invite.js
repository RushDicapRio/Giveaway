const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'invite',
    description: '➕ Invitez le bot sur votre serveur !',
    run: async (client, interaction) => {
    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel(`Invite ${client.user.username}`)
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`),
        new ButtonBuilder()
        .setLabel('Serveur de support')
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/"),
    )
    let invite = new EmbedBuilder()
      .setAuthor({ 
          name: `Invite ${client.user.username}`, 
          iconURL: client.user.displayAvatarURL() 
      })    
    .setTitle("Invite & Lien du support !")
    .setDescription(`Invite ${client.user} sur votre serveur aujourd'hui et profitez de giveaways transparents avec des fonctionnalités avancées !`)
    .setColor('#2F3136')
    .setTimestamp()
    .setFooter({
        text: `Demandé par ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
    })
    
    interaction.reply({ embeds: [invite], components: [row]});
}
}