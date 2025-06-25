const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { version } = require("../../package.json");

const os = require("node:os");
const bs = require("byte-size");
const convertMs = require("../../functions/TimeDescriptor.js");

module.exports = {
    data: {
        type: 1,
        name: "stats",
        description: "Sending bot statistics"
    },
    async execute(i) {
        await i.deferReply();
        
        const botInfoEmbed = new EmbedBuilder()
            .setColor(i.config.Color)
            .setTitle(i.client.user.username+"'s Bot Information")
            .setThumbnail(i.client.user.displayAvatarURL({ size: 1024, forceStatic: true }))
            .addFields(
                { name: "Version", value: version, inline: true },
                { name: "Guild Count", value: i.client.guilds.cache.size.toLocaleString().replaceAll(",", "."), inline: true },
                { name: "User Count", value: i.client.users.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString().replaceAll(",", "."), inline: true },
                { name: "API Latency", value: `${i.client.ws.ping}ms`, inline: true },
                { name: "Response Latency", value: `${Date.now() - i.createdAt}ms`, inline: true },
                { name: "Bot Uptime", value: `<t:${Math.round((Date.now() - (i.client.uptime ?? 0)) / 1000)}:R>`, inline: true }
            );
        
        const totalSeconds = os.uptime();
        const seconds = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const minutes = Math.floor((totalSeconds / 60) % 60);
        
        const realUptime = convertMs({ days, hours, minutes, seconds });
        
        const systemInfoEmbed = new EmbedBuilder()
            .setColor(i.config.Color)
            .setTitle("System Information")
            .setThumbnail("https://i.ibb.co/0G7QhP7/linux.png")
            .addFields(
                { name: "OS", value: os.type(), inline: true },
                { name: "Release", value: os.release(), inline: true },
                { name: "Arch", value: os.machine(), inline: true },
                { name: "CPU", value: os.cpus()[0].model, inline: true },
                { name: "CPU Load", value: `${os.loadavg()[0]}%`, inline: true },
                { name: "Cores", value: os.cpus().length.toString(), inline: true },
                { name: "RAM Usage", value: `${bs(os.totalmem()-os.freemem())} / ${bs(os.totalmem())}`, inline: true },
                { name: `System Uptime`, value: `<t:${Math.round((Date.now()-realUptime)/1000)}:R>`, inline: true }
            );
        
        const buttons = [
            new ButtonBuilder()
                .setCustomId("botInfoStatus")
                .setLabel("Bot")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("sytemInfoStatus")
                .setLabel("System")
                .setStyle(ButtonStyle.Primary)
        ];
        
        const embeds = [botInfoEmbed, systemInfoEmbed];
        
        await i.editReply({ embeds: [botInfoEmbed], components: [new ActionRowBuilder().addComponents(buttons)] });
    }
}