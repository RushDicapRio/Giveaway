const Discord = require("discord.js")
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
  partials: [
    Partials.Message, // pour message
    Partials.Channel, // pour salon textuel
    Partials.GuildMember, // pour membre du serveur
    Partials.Reaction, // pour message reaction
  ],
  intents: [
    GatewayIntentBits.Guilds, // pour les choses liées au serveur
    GatewayIntentBits.GuildInvites, // pour la gestion des invitations du serveur
    GatewayIntentBits.GuildMessages, // pour les messages du serveur
    GatewayIntentBits.GuildMessageReactions, // pour les réactions aux messages 
    GatewayIntentBits.MessageContent, // activer si vous avez besoin de contenu de message
  ],
});
const fs = require("fs");
const config = require("./config.json");
client.config = config;

// Initialiser les giveaways Discord
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./storage/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#2F3136",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: `🛑 **Dernière chance d'entrer** 🛑`,
      threshold: 5000,
      embedColor: '#FF0000'
    }
  }
});

/* Charger tous les événements (basés sur discord) */


fs.readdir("./events/discord", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Evènement]   ✅  Chargé : ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
  });
});

/* Charger tous les événements (basés sur les giveaways) */


fs.readdir("./events/giveaways", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/giveaways/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Evènement]   🎉 Chargé : ${eventName}`);
    client.giveawaysManager.on(eventName, (...file) => event.execute(...file, client)), delete require.cache[require.resolve(`./events/giveaways/${file}`)];
  })
})

// Laissez les commandes être une nouvelle collection (commandes de message)
client.commands = new Discord.Collection();
/* Charger toutes les commandes */
fs.readdir("./commands/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, {
      name: commandName,
      ...props
    });
    console.log(`[Commande] ✅  Chargé : ${commandName}`);
  });
});

// laisser les interactions être une nouvelle collection (commandes slash)
client.interactions = new Discord.Collection();
// créer un tableau vide pour enregistrer les commandes slash
client.register_arr = []
/* Charger toutes les commandes slash */
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, {
      name: commandName,
      ...props
    });
    client.register_arr.push(props)
  });
});

// Connectez-vous via le client
client.login(config.token);