const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: '🏓Vérifier mon ping !',
    run: async (client, interaction) => {
      let pembed = new EmbedBuilder()
		  .setColor('#2F3136')	
		  .setTitle('Ping du Bot')
		  .addFields({ name: '**Latence**', 
                   value: `\`${Date.now() - interaction.createdTimestamp}ms\``
                 })
		  .addFields({ name: "**Lantence de l'API**", 
                   value: `\`${Math.round(client.ws.ping)}ms\``
                 })
		  .setTimestamp()
                  .setFooter({
                     text: `${interaction.user.username}`,
                     iconURL: interaction.user.displayAvatarURL()
                  })
        interaction.reply({
          embeds: [pembed]
        });
    },
};