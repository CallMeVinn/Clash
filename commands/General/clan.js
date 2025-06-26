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

        embed.setColor(i.config.Color)
            .setTitle(clan.name)
            .setURL(clan.shareLink)
            .setDescription(clan.description)
            .setThumbnail(clan.badge.url)
            .addFields(
                { name: "Leader", value: clan.members.find(member => member.role == "leader").name, inline: false },
                { name: 'Members', value: `${clan.memberCount}`, inline: false },
                { name: 'Location', value: `${clan.location?.name ?? 'Not Set'}`, inline: false },
                { name: 'Trophies', value: `${clan.points}`, inline: false },
                { name: 'Builder Trophies', value: `${clan.builderBasePoints}`, inline: true },
                { name: 'Clan War League', value: `${clan.warLeague?.name ?? 'No League'}`, inline: true },
                { name: 'Chat Language', value: `${clan.chatLanguage?.name ?? 'Not Set'}`, inline: true }
            );
        
        const buttons = [
            new ButtonBuilder()
                .setCustomId("clan_members")
                .setLabel("Members")
                .setStyle(ButtonStyle.Primary)
        ];
        
        await i.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(buttons)] });
        return;
    }
}