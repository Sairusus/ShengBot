import { Events, MessageFlags } from "discord.js";

// Enables listener that triggers when slash command is ran by Discord user
export default {
    name: Events.InteractionCreate,
    async execute(interaction){
        if (!interaction.isChatInputCommand()) return;

        // Grab command from the collection, if it exists
        const command = interaction.client.commands.get(interaction.commandName);
        if(!command){
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try{
            await command.execute(interaction);
        }
        catch(error){
            console.log(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            }
        }
    }
}