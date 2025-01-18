import { Events, EmbedBuilder } from "discord.js";
import { serverStarboards, serverMinStars } from "../commands/starboard.js";

export default {
    name: Events.MessageReactionAdd,
    async execute(reaction, user){
        const guildId = reaction.message.guildId;
        const starboardChannelId = serverStarboards.get(guildId);
        const minStars = serverMinStars.get(guildId);
        
        if (reaction.partial) {
            try{
                await reaction.fetch();
            } 
            catch (error){
                console.error('Something went wrong when fetching the message:\n', error);
                return;
            }
        }

        if(!(starboardChannelId && reaction.emoji.name === "⭐" && reaction.count >= minStars)) return;

        let content = reaction.message.content || null;
        const attachmentUrls = reaction.message.attachments.map((attachment) => attachment.url);
        if (content && content.length > 256) content = content.slice(0, 253) + "...";

        const starEmbed = new EmbedBuilder()
            .setAuthor({name: user.displayName, iconURL: user.avatarURL()})
            .setTitle(content)
            .setImage(attachmentUrls[0])
            .setDescription(reaction.message.url)
            .setColor('Random');
        
        try{
            reaction.client.channels.cache.get(starboardChannelId).send({ embeds: [starEmbed] })
        }
        catch (error){
            console.log("Error while sending embed:\n", error)
        }
    },
}