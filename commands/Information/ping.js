const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        type: 1,
        name: "ping",
        description: "Sending bot latency"
    },
    async execute(i) {
        await i.deferReply();
        
        const timestamp = await Date.now();
        
        await i.editReply({ embeds: [new EmbedBuilder().setColor(i.config.Color).setDescription(`Pong! **${timestamp - i.createdTimestamp}** ms`)] });
        return;
    }
}