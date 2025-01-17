import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages] });

const start_bot = () => {
    client.on(Events.ClientReady, readyClient => {
        console.log(`Logged in as ${readyClient.user.tag}!`);
    });
    client.login(process.env.DISCORD_TOKEN);
}

start_bot();