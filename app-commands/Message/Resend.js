const { MessageFlags } = require("discord.js");

module.exports = {
    data: {
        type: 3,
        name: "Resend"
    },
    execute(client, interaction) {
        interaction.reply({ content: interaction.targetMessage.content, flags: [MessageFlags.Ephemeral] });
        return;
    }
}