import { SlashCommandBuilder, MessageFlags, Collection, ChannelType } from "discord.js";

const serverStarboards = new Collection();

const enable = async (interaction) => {
    const channel = interaction.options.getChannel("channel")
    const guild = interaction.guild;

    if(serverStarboards.get(guild.id)){
        await interaction.reply({ content: `${guild.name} already has a starboard. Use 'starboard set' to change the output channel.`, flags: MessageFlags.Ephemeral });
        return;
    }
    
    serverStarboards.set(guild.id, channel.id);

    try {
        await interaction.reply({ content: `${channel.name} will be the starboard for ${guild.name}`, flags: MessageFlags.Ephemeral });
    }
    catch (error){
        console.log(channel);
        console.log(error);
        await interaction.reply({ content: `An internal error has occured.`, flags: MessageFlags.Ephemeral });
    }
}

const disable = async (interaction) => {
    
}

const set = async (interaction) => {
    
}

const min = async (interaction) => {
    
}

const subCommands = new Collection([
    ["enable", enable],
    ["disable", disable],
    ["set", set],
    ["min", min]
]);

export default {
    data: new SlashCommandBuilder()
    .setName("starboard")
    .setDescription("Setup the starboard.")
    .addSubcommand(subCommand => 
        subCommand 
            .setName("enable")
            .setDescription("Enables the starboard output to a channel.")
            .addChannelOption(option => 
                option
                .setName("channel")
                .setDescription("Channel for starboard output.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
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
        const subCommandName = interaction.options.getSubcommand()
        const subCommandExecute = subCommands.get(subCommandName);
        subCommandExecute(interaction);
    },
}

