import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { get_dir_fileUrls } from './utils/find_dir_files.js';
import 'dotenv/config'

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Reaction]
});

// Attaching collection to client to store commands
client.commands = new Collection();

const commandFilesUrls = await get_dir_fileUrls(import.meta.url, 'commands');

// Loop through each .js file
for(const fileUrl of commandFilesUrls){
    const command = await import(fileUrl).then(mod => mod.default || mod);

    if('data' in command && 'execute' in command){
        // Add command to commands collection
        client.commands.set(command.data.name, command)
    }
    else {
        console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
    }
}

const eventFilesUrls = await get_dir_fileUrls(import.meta.url, 'event_handlers');

for(const eventUrl of eventFilesUrls){
    const event = await import(eventUrl).then(mod => mod.default || mod);

    if(event.once){
        client.once(event.name, (...args) => event.execute(...args))
    }
    else{
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(process.env.DISCORD_TOKEN);