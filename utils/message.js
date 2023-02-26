const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY FINI** 🎉",
  drawing:  `Fin: **{timestamp}**`,
  inviteToParticipate: `Réagissez avec 🎉 pour participer !`,
  winMessage: "Félicitations, {winners} ! Vous avez gagné **{this.prize}**!",
  embedFooter: "{this.winnerCount} gagnant(s)",
  noWinner: "Concours annulé, aucune participation valide.",
  hostedBy: "Hébergé par : {this.hostedBy}",
  winners: "gagnant(s)",
  endedAt: "Fini dans"
}