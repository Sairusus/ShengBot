import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import 'dotenv/config'

const commands = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsFolder = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const filePath = path.join(commandsFolder, file);
    const fileUrl = pathToFileURL(filePath).href;
    const command = await import(fileUrl).then(mod => mod.default || mod);
    if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
	}
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Deploy slash commands to Discord (only do this once whenever new commands are added or updated)
export async function deploy_to_global(){
	console.log("DEPLOY TO GLOBAL");
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
};

export async function deploy_to_test_server(){
	console.log("DEPLOY TO TEST SERVER");
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}