const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");
const { Util } = require("clashofclans.js");

module.exports = {
    data: {
        type: 1,
        name: "player",
        description: "Searching player of CoC game",
        
        options: [{
            type: 3,
            name: "player-tag",
            description: "Input player tag (e.g.: #PVQ2UYCPC)",
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
                        .setDescription(`Please input **player-tag** to search! (e.g.: \`${i.config.Prefix}player #PVQ2UYCPC\`)`)]
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
        const playerEmbed = require("../../embeds/Player.js")(player);
        
        const buttons = [
            new ButtonBuilder()
                .setLabel("Clan")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("player_troops")
                .setLabel("Troops")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("player_heroes")
                .setLabel("Heroes")
                .setStyle(ButtonStyle.Primary),
        ];
        
        if (!player.clan) buttons[0].setStyle(ButtonStyle.Secondary).setDisabled(true);
        else buttons[0].setCustomId("clan_"+player.clan.tag+"_"+i.author.id);
        
        await i.editReply({ embeds: [playerEmbed], components: [new ActionRowBuilder().addComponents(buttons)] });
        return;
    }
}