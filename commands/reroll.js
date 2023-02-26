const ms = require('ms');
module.exports.run = async (client, message, args) => {

    // Si le membre n'a pas assez d'autorisations
    if(!message.member.permissions.has('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.reply(':x: Vous devez disposer des autorisations de gestion des messages pour relancer les giveaways.');
    }

    // Si aucun ID de message ou nom de giveaway n'est spécifié
    if(!args[0]){
        return message.reply(':x: Vous devez spécifier un ID de message valide !');
    }

    // essayez de trouver le giveaway avec le prix ou avec l'ID
    let giveaway = 
    // Recherche via le prix du giveaway
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // recherche via l'ID du giveaway
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // Si aucun giveaway n'a été trouvé
    if(!giveaway){
        return message.reply('Impossible de trouver un giveaway pour `'+ args.join(' ') +'`.');
    }

    // Relancé le giveaway
    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Message de réussite
        message.reply('Giveaway relancé !');
    })
    .catch((e) => {
        if(e.startsWith(`Le giveaway avec l'ID de message ${giveaway.messageID} n'est pas terminé.`)){
            message.reply("Ce giveaway n'est pas terminé !");
        } else {
            console.error(e);
            message.reply(e);
        }
    });
};