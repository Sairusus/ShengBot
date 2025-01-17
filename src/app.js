import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import 'dotenv/config'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages] });

// Attaching map to client to store commands as {commandName: execute(interaction)}
client.commands = new Collection();

// Grab path to this file (../ShengBot/src/app.js)
const __filename = fileURLToPath(import.meta.url);
// Grab path of directory (../ShengBot/src/)
const __dirname = path.dirname(__filename);
// ../ShengBot/src/commands
const commandsFolder = path.join(__dirname, 'commands');
// Return string array of .js filenames in commands folder
const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));

// Loop through each .js file
for(const file of commandFiles){
    // Create path to the file and change format for import()
    const filePath = path.join(commandsFolder, file);
    const fileUrl = pathToFileURL(filePath).href;

    const command = await import(fileUrl).then(mod => mod.default || mod);

    if('data' in command && 'execute' in command){
        // Add command to commands map
        client.commands.set(command.data.name, command)
    }
    else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
}


// Enables listener that triggers when slash command is ran by Discord user
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    // Grab command from the map, if it exists
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