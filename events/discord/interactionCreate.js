module.exports = (client, interaction) => {
 // Vérifiez si notre interaction est une commande slash
    if (interaction.isCommand()) {

 // Obtenez la commande de notre collection de commandes slash
    const command = client.interactions.get(interaction.commandName);

// Si la commande n'existe pas, renvoie un message d'erreur
    if (!command) return interaction.reply({
      content: "Quelque chose s'est mal passé | Peut-être que la commande n'est pas enregistrée ?",
      ephemeral: true
    });

    command.run(client, interaction);
  }
}