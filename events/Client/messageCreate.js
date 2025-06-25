const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const CommandInterface = require("../../structures/CommandInterface.js");

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const missingPermissions = [];

    for (const perm of botPermissions) {
        if (!message.channel.permissionsFor(message.guild.members.me).has(perm)) missingPermissions.push(perm);
    }

    if (missingPermissions.length > 0) {
        const content = `The bot doesn't have one of these permissions \`${missingPermissions.join(", ")}\`.\nPlease double check them in your server role & channel settings.\n\nServer: **${message.guild.name}**`;

        const dmChannel = message.author.dmChannel || await message.author.createDM();

        return dmChannel.send({ content });
    }

    const prefix = client.config.Prefix;
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    const embed = new EmbedBuilder().setColor(client.config.Color);
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Invite").setURL(client.config.Invite).setStyle(ButtonStyle.Link),
        new ButtonBuilder().setLabel("Support Server").setURL(client.config.Discord).setStyle(ButtonStyle.Link),
        new ButtonBuilder().setLabel("Website").setURL(client.config.Website).setStyle(ButtonStyle.Link),
    );

    if (message.content.match(mention)) {
        embed.setDescription(`Use \`${prefix}help\` command to get list of commands.`);

        message.reply({ embeds: [embed], components: [row] });
    }

    const rawContent = message.content.toLowerCase();
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${client.user.username.toLowerCase()}|${escapeRegex(prefix)})\\s*`);

    if (!prefixRegex.test(rawContent)) return;

    const [matchedPrefix] = rawContent.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (!cmd.length) return;

    let command = client.commands.get(cmd) ?? client.commands.find(command => command.aliases.includes(cmd));

    if (!command) return;

    command.execute(
        new CommandInterface(message, args)
    );
    
    if (message.author.id != client.config.DeveloperId) console.log(`[CommandUsage] ${command.name} | ${message.author.username} - ${message.author.id} | ${message.guild.name} - ${message.guildId}`);
}