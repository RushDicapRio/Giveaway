module.exports = (client, message) => {
    // retour si l'auteur est un bot
    if (message.author.bot) return;
  
    // retourner si le message ne correspond pas au préfixe (dans la commande)
    if (message.content.indexOf(client.config.prefix) !== 0) return;
  
    // Définir ce que sont les arguments et les commandes
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Obtenez les données de commande à partir du client.commands Enmap
    const cmd = client.commands.get(command);
  
    // Si la commande n'existe pas retour
    if (!cmd) return;
  
    // Exécutez la commande
    cmd.run(client, message, args);
};