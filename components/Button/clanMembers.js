const { MessageFlags } = require("discord.js");

module.exports = {
    customId: "clanMembers_",
    async execute(client, interaction) {
        const args = interaction.customId.split("_");
        
        const clanTag = args[1];
        const authorId = interaction.message.interaction.user.id;
        
        if (interaction.user.id !== authorId) return interaction.reply({ content: "This button is not for you!", flags: [MessageFlags.Ephemeral] });
        
        const clan = await client.coc.getClan(clanTag);
        
        return interaction.reply({ content: "Cooming Soon!", flags: [MessageFlags.Ephemeral] });
    }
}