const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'list',
  description: '🎉 Répertorier tous les giveaways actifs pour ce serveur.',
  run: async (client, interaction) => {
    const select = new Discord.SelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder('Choisissez un type de giveaways à afficher!')
      .addOptions([
        {
          label: '🎉 Giveaways Normaux',
          description: "Vérifiez les giveaways en cours d'exécution sur votre serveur !",
          value: 'normal',
        },
      ]);
    const row = new Discord.ActionRowBuilder().addComponents([select]);
    let giveaways = client.giveawaysManager.giveaways.filter(
      (g) => g.guildId === `${interaction.guild.id}` && !g.ended
    );
    if (!giveaways.some((e) => e.messageId)) {
      return interaction.reply('💥 Aucun giveaway à afficher');
    }
    const msg = await interaction.channel.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setDescription('Choisissez une option dans le menu de sélection pour commencer !')
          .setColor('#f542ec')
          .setTimestamp(),
      ],
      components: [row],
    });
    let embed = new Discord.EmbedBuilder()
      .setTitle('Giveaways actuellement actifs')
      .setColor('#f58142')
      .setFooter({
          text: `Demandé par ${interaction.user.username} | ` + config.copyright,
          iconURL: interaction.user.displayAvatarURL()
      })
      .setTimestamp();
    const filter = (x) =>
      x.customId == 'select' && x.user.id == interaction.member.id;
    const collector = await interaction.channel.createMessageComponentCollector(
      { filter, time: 60000, max: 1 }
    );
    await interaction.deferReply();
    collector.on('collect', async (i) => {
      const val = i.values[0];
      if (val == 'normal') {
        await Promise.all(
          giveaways.map(async (x) => {
            embed.addFields({ name:
              `Giveaway Normal :`, value: `**Prix :** **[${x.prize}](https://discord.com/channels/${x.guildId}/${x.channelId}/${x.messageId})\nLnacé :** <t:${((x.startAt)/1000).toFixed(0)}:R> (<t:${((x.startAt)/1000).toFixed(0)}:f>)\n**Fin :** <t:${((x.endAt)/1000).toFixed(0)}:R> (<t:${((x.endAt)/1000).toFixed(0)}:f>)`
              });
          })
        );
        msg.delete();
        interaction.editReply({ embeds: [embed], components: [] });
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason == 'time') {
        interaction.editReply({
          content: 'Collecteur détruit, réessayez !',
          components: [],
        });
      }
    });
  },
};