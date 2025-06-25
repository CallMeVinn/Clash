const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");
const { Util } = require("clashofclans.js")

module.exports = {
    data: {
        type: 1,
        name: "player",
        description: "Searching player of CoC game",
        
        options: [{
            type: 3,
            name: "player-tag",
            description: "Input player tag to search"
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
                        .setDescription("Please input **player-tag** to search!")]
            });
            return;
        }
        
        if (!Util.isValidTag(Util.formatTag(query))) {
            i.editReply({
                embeds: [
                    embed.setColor("Red")
                        .setDescription(`\`${query}\` is not valid **player-tag**!`)]
            });
            return;
        }
        
        const player = await i.coc.getPlayer(query);

        embed.setColor(i.client.Color)
            .setTitle(player.name)
            .setURL(player.shareLink)
            .setThumbnail(player.league.icon.url)
            .addFields(
                { name: 'Clan', value: player.clan ? player.clan.name : "`No Clan`" },
                { name: 'Level', value: `${player.expLevel}`, inline: false },
                { name: 'Town Hall', value: `${player.townHallLevel}`, inline: false },
                { name: 'Trophies', value: `${player.trophies}`, inline: false },
                { name: 'Best Trophies', value: `${player.bestTrophies}`, inline: false },
                /*{ name: 'Donations', value: `${player.donations}`, inline: false },
                { name: 'Donations Received', value: `${player.received}`, inline: false },*/
                { name: 'War Stars', value: `${player.warStars}`, inline: true },
                { name: 'Attack - Defense', value: `${player.attackWins} - ${player.defenseWins}`, inline: false }
            );
        
        const buttons = [
            new ButtonBuilder()
                .setCustomId("player_troops")
                .setLabel("Troops")
                .setStyle(ButtonStyle.Primary)
        ];
        
        await i.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(buttons)] });
        return;
    }
}