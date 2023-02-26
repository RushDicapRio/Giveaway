const register = require('../../utils/slashsync');
const { ActivityType } = require('discord.js');

module.exports = async (client) => {
  await register(client, client.register_arr.map((command) => ({
    name: command.name,
    description: command.description,
    options: command.options,
    type: '1'
  })), {
    debug: true
  });
  // Enregistrer les commandes slash - (Si vous faites partie de ces personnes qui lisent les codes, je suggère fortement de l'ignorer car je suis très mauvais dans ce que je fais, merci LMAO)
  console.log(`[ / | Commandes Slash ] - ✅ Chargé toutes les commandes slash !`)
  let invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`;
  console.log(`[STATUS] ${client.user.tag} est maintenant en ligne !\n[INFO] Bot by Saez#0001 https://github.com//RushDicapRio ${invite}`);
  client.user.setPresence({
  activities: [{ name: `Saez#0001 sur GitHuB`, type: ActivityType.Watching }],
  status: 'online',
});
};