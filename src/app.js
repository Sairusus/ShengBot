import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import 'dotenv/config'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsFolder = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const filePath = path.join(commandsFolder, file);
    const fileUrl = pathToFileURL(filePath).href;
        const command = await import(fileUrl).then(mod => mod.default || mod);

    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command)
    }
    else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
}

/*
    Enables listener that triggers when slash command is ran by Discord user
*/
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`No command matching ${interaction.commandName} was found.`);
		return;
    }

    try{
        await command.execute(interaction);

    }
    catch(error){
        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
    }
});


client.once(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);