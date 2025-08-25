require('dotenv').config();  // carga variables .env lo primero

const token = process.env.DISCORD_TOKEN;

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
const { loadButtons } = require('./Handlers/buttonHandler'); 

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages],
  partials: [User, Message, GuildMember, ThreadMember]
});


client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection(); 

(async () => {
  try {
    await loadEvents(client);
    await loadButtons(client); 

    await client.login(token);

    client.once('ready', async () => {
      await loadCommands(client);  
      console.log(`✅ El cliente se ha iniciado correctamente: ${client.user.tag}`);
    });

  } catch (error) {
    console.error("❌ Error al iniciar el bot:", error);
  }
})();
