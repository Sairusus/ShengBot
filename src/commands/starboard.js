import { SlashCommandBuilder, MessageFlags, Collection, ChannelType } from "discord.js";

const serverStarboards = new Collection();
const serverMinStars = new Collection();
export { serverStarboards, serverMinStars };

const enable = async (interaction) => {
    const channel = interaction.options.getChannel("channel")
    const guild = interaction.guild;

    if(serverStarboards.get(guild.id)){
        await interaction.reply({ content: `${guild.name} already has a starboard. Use 'starboard set' to change the output channel.`, flags: MessageFlags.Ephemeral });
        return;
    }

    serverStarboards.set(guild.id, channel.id);

    await interaction.reply({ content: `${channel.name} will be the starboard for ${guild.name}`, flags: MessageFlags.Ephemeral });
}

const disable = async (interaction) => {
    const guild = interaction.guild;
    serverStarboards.delete(guild.id);
    await interaction.reply({ content: `Starboard has been disabled.`, flags: MessageFlags.Ephemeral });
}

const set = async (interaction) => {
    const guild = interaction.guild;
    const channel = interaction.options.getChannel("channel");

    if(!serverStarboards.get(guild.id)){
        await interaction.reply({ content: `Starboard is not enabled. Use 'starboard enable'.`, flags: MessageFlags.Ephemeral });
        return;
    }
    
    serverStarboards.set(guild.id, channel.id);
    
    await interaction.reply({ content: `${channel.name} will be the starboard for ${guild.name}`, flags: MessageFlags.Ephemeral });
}

const min = async (interaction) => {
    const guild = interaction.guild;
    const starCount = interaction.options.getInteger("min-stars");

    if(!serverStarboards.get(guild.id)){
        await interaction.reply({ content: `Starboard is not enabled. Use 'starboard enable'.`, flags: MessageFlags.Ephemeral });
        return;
    }

    serverMinStars.set(guild.id, starCount);
    await interaction.reply({ content: `${starCount} stars are now required to post in starboard.`, flags: MessageFlags.Ephemeral });    
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
            .addChannelOption(option => 
                option
                .setName("channel")
                .setDescription("Channel for starboard output.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
    )
    .addSubcommand(subCommand => 
        subCommand 
            .setName("min")
            .setDescription("Sets the minimum stars required to post in starboard.")
            .addIntegerOption(option => 
                option
                .setName("min-stars")
                .setDescription("Minimum stars required for starboard.")
                .setRequired(true))
    ),
    async execute(interaction){
        try{
            const subCommandName = interaction.options.getSubcommand()
            const subCommandExecute = subCommands.get(subCommandName);
            subCommandExecute(interaction);
        }
        catch (error){
            console.log(error);
            await interaction.reply({ content: `An internal error has occured.`, flags: MessageFlags.Ephemeral });
        }
    },
}

