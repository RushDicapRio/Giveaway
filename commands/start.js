const ms = require("ms");
const messages = require("../utils/message");
module.exports.run = async (client, message, args) => {
  // Si le membre n'a pas assez d'autorisations
  if (
    !message.member.permissions.has("MANAGE_MESSAGES") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      ":x: Vous devez disposer des autorisations de gestion des messages pour lancer des giveaways."
    );
  }

  // Salon du giveaway
  let giveawayChannel = message.mentions.channels.first();
  // Si aucun salon n'est mentionnée
  if (!giveawayChannel) {
    return message.reply(":x: Vous devez mentionner un salon valide !");
  }

  // Durée du giveaway
  let giveawayDuration = args[1];
  // Si la durée n'est pas valide
  if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
    return message.reply(":x: Vous devez spécifier une durée valide !");
  }

  // Nombre de gagnant(s)
  let giveawayNumberWinners = parseInt(args[2]);
  // Si le nombre spécifié de gagnants n'est pas un nombre
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.reply(
      ":x: Vous devez spécifier un nombre valide de gagnants !"
    );
  }

  // Prix du giveaway
  let giveawayPrize = args.slice(3).join(" ");
  // Si aucun prix n'est spécifié
  if (!giveawayPrize) {
    return message.reply(":x: Vous devez spécifier un prix valide !");
  }
  // Lancé le giveaway
  await client.giveawaysManager.start(giveawayChannel, {
    // Durée du giveaway
    duration: ms(giveawayDuration),
    // Prix du giveaway
    prize: giveawayPrize,
    // Nombre de gagnant(s) au giveaway
    winnerCount: parseInt(giveawayNumberWinners),
    // Qui héberge ce giveaway
    hostedBy: client.config.hostedBy ? message.author : null,
    // Messages
    messages
  });
  message.reply(`Giveaway lancé dans ${giveawayChannel}!`);
}