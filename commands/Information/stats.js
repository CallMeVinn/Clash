const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, MessageFlags } = require("discord.js");
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
                { name: "User Count", value: i.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString().replaceAll(",", "."), inline: true },
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
        
        const RAMUsed = bs(os.totalmem()-os.freemem());
        const RAMTotal = bs(os.totalmem());
        
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
                { name: "RAM Usage", value: `${RAMUsed.value}${RAMUsed.unit} / ${RAMTotal.value}${RAMTotal.unit}`, inline: true },
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
        
        await i.editReply({ content: null, embeds: [botInfoEmbed], components: [new ActionRowBuilder().addComponents(buttons)] });
        
        await clickButtonCollector(i, embeds, buttons);
    }
}

async function clickButtonCollector(i, embeds, buttons) {
    const message = await i.fetchReply();
        if (!message) return i.msg.edit({ components: [] });
        
        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000*3,
            filter: (interaction) => {
                if (interaction.user.id != i.author.id) {
                    interaction.reply({ content: "This button is not for you!", flags: [MessageFlags.Ephemeral] });
                    return false;
                } else return true;
            }
        });
        
        collector.on("collect", async(interaction) => {
            if (!interaction.deferred) await interaction.deferUpdate();
            buttons.forEach(button => button.setStyle(ButtonStyle.Primary).setDisabled(false));
            let page = 0;
            switch(interaction.customId) {
                case buttons[0].data.custom_id: {
                    buttons[0].setStyle(ButtonStyle.Secondary).setDisabled(true);
                    break;
                }
                case buttons[1].data.custom_id: {
                    page += 1;
                    buttons[1].setStyle(ButtonStyle.Secondary).setDisabled(true);
                    break;
                }
                default:
                    break;
            }
            
            await interaction.editReply({ embeds: [embeds[page]], components: [new ActionRowBuilder().addComponents(buttons)] });
            collector.resetTimer({ time: 60000*5 });
        });
        
        collector.on("end", () => {
            if (!message && !message?.channel?.messages.cache.get(message.id)) return;
            message.edit({ components: [] });
        });
}