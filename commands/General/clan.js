const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");
const { Util } = require("clashofclans.js");

module.exports = {
    data: {
        type: 1,
        name: "clan",
        description: "Searching clan CoC game",
        
        options: [{
            type: 3,
            name: "clan-tag",
            description: "Input clan tag (e.g.: #2Q082JYVY)",
            required: true,
        }]
    },
    async execute(i) {
        await i.deferReply();
        
        const query = i.args.join(" ");
        const embed = new EmbedBuilder();
        
        if (!query) {
            await i.editReply({
                embeds: [
                    embed.setColor("Red")
                        .setDescription(`Please input **clan-tag** to search! (e.g.: \`${i.config.Prefix}clan #2Q082JYVY\`)`)]
            });
            return;
        }
        
        if (!Util.isValidTag(Util.formatTag(query))) {
            await i.editReply({
                embeds: [
                    embed.setColor("Red")
                        .setDescription(`\`${query}\` is not valid **clan-tag**!`)]
            });
            return;
        }
        
        const clan = await i.coc.getClan(query);
        const clanEmbed = require("../../embeds/Clan.js")(clan);
        
        const buttons = [
            new ButtonBuilder()
                .setCustomId("clanMembers"+clan.tag+"_"+i.author.id)
                .setLabel("Members")
                .setStyle(ButtonStyle.Primary)
        ];
        
        await i.editReply({ embeds: [clanEmbed], components: [new ActionRowBuilder().addComponents(buttons)] });
        return;
    }
}