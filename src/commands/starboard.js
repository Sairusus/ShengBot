import { SlashCommandBuilder, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
    .setName("starboard")
    .setDescription("Setup the starboard.")
    .addSubcommand(subCommand => 
        subCommand 
            .setName("enable")
            .setDescription("Enables the starboard output to a channel.")
            .addStringOption(option => option.setName("channel-id").setDescription("Channel ID for starboard output.").setRequired(true))
    )
    .addSubcommand(subCommand => 
        subCommand 
            .setName("disable")
            .setDescription("Disables the starboard.")
    )
    .addSubcommand(subCommand => 
        subCommand 
            .setName("set")
            .setDescription("Sets a new channel for starboard output.")
            .addStringOption(option => option.setName("channel-id").setDescription("Channel ID for starboard output.").setRequired(true))
    )
    .addSubcommand(subCommand => 
        subCommand 
            .setName("min")
            .setDescription("Sets the minimum stars required to post in starboard.")
            .addIntegerOption(option => option.setName("min-stars").setDescription("Minimum stars required for starboard.").setRequired(true))
    )
    ,
    async execute(interaction){
        await interaction.reply({ content: "WIP!", flags: MessageFlags.Ephemeral });
    },
}