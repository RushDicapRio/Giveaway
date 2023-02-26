const Discord = require('discord.js'),
  { EmbedBuilder } = Discord,
  parsec = require('parsec'),
  messages = require('../utils/message');

module.exports.run = async (client, message) => {
  const collector = message.channel.createMessageCollector({
    filter: (m) => m.author.id === message.author.id,
    time: 60000,
  });

  let xembed = new EmbedBuilder()
  .setTitle("Oops! On dirait que nous avons rencontré un délai d'attente ! 🕖")
  .setColor("#FF0000")
  .setDescription('💥 Tentez votre chance !\nVous avez mis trop de temps à vous décider !\nUtilisez à nouveau ``créer`` pour lancer un nouveau giveaway !\nEssayez de répondre dans les **30 secondes** cette fois !')
  .setFooter({
     text: `${client.user.username}`,
     iconURL: client.user.displayAvatarURL()
  })  
  .setTimestamp()


  function waitingEmbed(title, desc) {
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${message.author.tag} + ' | Giveaway Setup'`,
            iconURL: message.member.displayAvatarURL()
          })
          .setTitle('Giveaway ' + title)
          .setDescription(desc + ' dans les 60 prochaines secondes.')
          .setFooter({
            text: "Tapez 'annuler' pour quitter ce processus.",
            iconURL: client.user.displayAvatarURL()
           })
          .setTimestamp()
          .setColor('#2F3136'),
      ],

    });
  }

  let winnerCount, channel, duration, prize, cancelled;

  await waitingEmbed('Prix', 'Veuillez envoyer le prix du giveaway');

  collector.on('collect', async (m) => {
    if (cancelled) return;

    async function failed(options, ...cancel) {
      if (typeof cancel[0] === 'boolean')
        (cancelled = true) && (await m.reply(options));
      else {
        await m.reply(
          options instanceof EmbedBuilder ? { embeds: [options] } : options
        );
        return await waitingEmbed(...cancel);
      }
    }

    if (m.content === 'cancel'){ 
  collector.stop()
 return await failed('Création de giveaway annulé.', true) 
}

    switch (true) {
      case !prize: {
        if (m.content.length > 256)
          return await failed(
            'Le prix ne peut pas être plus de 256 caractères.',
            'Prix',
            'Veuillez envoyer le prix du giveaway'
          );
        else {
          prize = m.content;
          await waitingEmbed('Salon', 'Veuillez envoyer le salon giveaway');
        }

        break;
      }

      case !channel: {
        if (!(_channel = m.mentions.channels.first() || m.guild.channels.cache.get(m.content)))
          return await failed(
            'Veuillez envoyer un salonID/salon valide.',
            'Salon',
            'Veuillez envoyer le salon giveaway'
          );
        else if (!_channel.isTextBased())
          return await failed(
            'Le salon doit être un salon textuel.',
            'Salon',
            'Veuillez envoyer le salon giveaway'
          );
        else {
          channel = _channel;
          await waitingEmbed(
            'Nombre de gagnants',
            'Veuillez envoyer le nombre de gagnants du giveaway.'
          );
        }

        break;
      }

      case !winnerCount: {
        if (!(_w = parseInt(m.content)))
          return await failed(
            'Le nombre de gagnants doit être un entier.',

            'Nombre de gagnants',
            'Veuillez envoyer le nombre de gagnants du giveaway.'
          );
        if (_w < 1)
          return await failed(
            'Le nombre de gagnants doit être supérieur à 1.',
            'Nombre de gagnants',
            'Veuillez envoyer le nombre de gagnants du giveaway.'
          );
        else if (_w > 15)
          return await failed(
            'Le nombre de gagnants doit être inférieur à 15.',
            'Nombre de gagnants',
            'Veuillez envoyer le nombre de gagnants du giveaway.'
          );
        else {
          winnerCount = _w;
          await waitingEmbed('Durée', 'Veuillez envoyer la durée du giveaway');
        }

        break;
      }

      case !duration: {
        if (!(_d = parsec(m.content).duration))
          return await failed(
            'Veuillez fournir une durée valide.',
            'Durée',
            'Veuillez envoyer la durée du giveaway'
          );
        if (_d > parsec('21d').duration)
          return await failed(
            'La durée doit être inférieure à 21 jours !',
            'Durée',
            'Veuillez envoyer la durée du giveaway'
          );
        else {
          duration = _d;
        }

        return client.giveawaysManager.start(channel, {
          prize,
          duration,
          winnerCount,
          hostedBy: client.config.hostedBy ? message.author : null,
          messages,
        });
      }
    }
  });
  collector.on('end', (collected, reason) => {
    if (reason == 'time') {
       message.reply({ embeds: [xembed]})
    }
  })
};