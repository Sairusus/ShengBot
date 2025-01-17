import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
    .setName("starboard")
    .setDescription("Setup the starboard."),
    async execute(interaction){
        await interaction.reply("WIP!");
    },
}