const { EmbedBuilder } = require("discord.js");
const { Color, Emojis } = require("../config.js");

module.exports = (player) => {
    return new EmbedBuilder()
        .setColor(Color)
        .setTitle(player.name)
        .setURL(player.shareLink)
        .setDescription(player.labels.map(l => Emojis[l.name]).join(" "))
        .setThumbnail(player.league.icon.url)
        .addFields(
            { name: 'Clan', value: player.clan ? player.clan.name : "`-`" },
            { name: 'Level', value: `${player.expLevel}`, inline: false },
            { name: 'Town Hall', value: `${player.townHallLevel}`, inline: false },
            { name: 'Trophies', value: `${player.trophies}`, inline: true },
            { name: 'Best Trophies', value: `${player.bestTrophies}`, inline: true },
            { name: 'War Stars', value: `${player.warStars}`, inline: false },
            { name: 'Attack - Defense', value: `${player.attackWins} Win - ${player.defenseWins} Win`, inline: false }
        );
}