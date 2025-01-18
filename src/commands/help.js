import { SlashCommandBuilder, MessageFlags } from "discord.js";

const help_message = '```Available Commands:\n' + 'starboard enable|disable|set|min : Manage the starboard.\n' + 'help : Show this message.```';

export default {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available commands."),
    async execute(interaction){
        try{
            await interaction.reply({ content: help_message });
        }
        catch (error){
            console.log(error);
            await interaction.reply({ content: `An internal error has occured.`, flags: MessageFlags.Ephemeral });
        }
    }
}