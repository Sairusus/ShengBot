import { SlashCommandBuilder, MessageFlags } from "discord.js";

const help_message = '```Available Commands:\n' + 'starboard enable|disable|set|min : Manage the starboard.\n' + 'help : Show this message.```';

export default {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available commands.")
    ,
    async execute(interaction){
        await interaction.reply({ content: help_message });
    },
}