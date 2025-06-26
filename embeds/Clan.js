const { EmbedBuilder } = require("discord.js");
const { Color, Emojis } = require("../config.js");

module.exports = (clan) => {
    return new EmbedBuilder()
        .setColor(Color)
        .setTitle(clan.name)
        .setURL(clan.shareLink)
        .setDescription(clan.description+"\n\n"+clan.labels.map(l => Emojis[l.name.replaceAll(" ", "")]).join(" "))
        .setThumbnail(clan.badge.url)
        .addFields(
            { name: "Leader", value: clan.members.find(member => member.role == "leader").name, inline: false },
            { name: 'Members', value: `${clan.memberCount}/50`, inline: false },
            { name: 'Trophies', value: `${clan.points}`, inline: true },
            { name: 'Builder Trophies', value: `${clan.builderBasePoints}`, inline: true },
            { name: 'Clan War League', value: `${clan.warLeague?.name ?? 'No League'}`, inline: true },
            { name: 'Location', value: `${clan.location?.name ?? 'Not Set'}`, inline: true },
            { name: 'Chat Language', value: `${clan.chatLanguage?.name ?? 'Not Set'}`, inline: true }
        );
}