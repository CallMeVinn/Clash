const { MessageFlags } = require("discord.js");

module.exports = {
    data: {
        type: 2,
        name: "Avatar"
    },
    execute(interaction) {
        const user = interaction.targetUser;
        
        interaction.reply({ content: user.displayAvatarURL({ forceStatic: true, size: 2048 }), flags: [MessageFlags.Ephemeral] });
        return;
    }
}