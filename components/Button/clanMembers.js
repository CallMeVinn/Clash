const { MessageFlags } = require("discord.js");

module.exports = {
    customId: "clanMembers#",
    async execute(client, interaction) {
        const args = interaction.customId.split("_");
        
        const clanTag = args[0].replace("clan", "");
        const authorId = args[1];
        
        if (interaction.user.id !== authorId) return interaction.reply({ content: "This button is not for you!", flags: [MessageFlags.Ephemeral] });
        
        const clan = await client.coc.getClan(clanTag);
        
        return interaction.reply({ content: "Cooming Soon!", flags: [MessageFlags.Ephemeral] });
    }
}