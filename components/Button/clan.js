const { MessageFlags } = require("discord.js");

module.exports = {
    customId: "clan_",
    async execute(client, interaction) {
        const args = interaction.customId.split("_");
        
        const clanTag = args[1];
        const authorId = interaction.message.interaction.user.id;
        
        if (interaction.user.id !== authorId) return interaction.reply({ content: "This button is not for you!", flags: [MessageFlags.Ephemeral] });
        
        const clan = await client.coc.getClan(clanTag);
        const clanEmbed = require("../../embeds/Clan.js")(clan);
        
        return interaction.reply({ embeds: [clanEmbed], flags: [MessageFlags.Ephemeral] });
    }
}