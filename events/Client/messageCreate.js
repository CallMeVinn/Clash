const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const CommandInterface = require("../../structures/CommandInterface.js");

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    await setupUsers(client, message.author.id);
    await setupGuilds(client, message.guild.id);

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

    await sendIntro(client, message);
    command.execute(
        new CommandInterface(message, args)
    );
    
    if (message.author.id != client.config.DeveloperId) console.log(`[CommandUsage] ${command.data.name} | ${message.author.username} - ${message.author.id} | ${message.guild.name} - ${message.guildId}`);
    
    if (!command.private) client.pg.add(`command_used.${command.data.name}`, 1);
}

async function sendIntro(client, message) {
    const database = client.pg.users;
    const data = await database.get(message.author.id);
    
    if (data?.introduced) return;
    
    const embed = new EmbedBuilder()
        .setColor(client.config.Color)
        .setTitle("Introduction")
        .setDescription(`## Welcome, Chief!\nThanks for using **${client.user.username}**'s bot service!\n### ⚠️ Please Note: This bot is unofficial and not affiliated with **Supercell**. It was made by fans, for fans community.\n> This project follows the **Supercell Fan Content Policy**. We do not claim ownership of any trademarks, characters, or assets owned by **Supercell**. Full policy: https://supercell.com/en/fan-content-policy/`)
        .addFields({
            name: "Basic of Usage",
            value: "/clan : Sending clan information of CoC game\n/player : Sending player information of CoC game\n/help : Sending all commands list and this help to get you started.",
        },
        {
            name: "Binding Profile?",
            value: "You can bind coc game profile to this bot by using the command /profile and follow all the setup instructions."
        });
    
    message.channel.send({ embeds: [embed] });
    
    await database.set(`${message.author.id}.introduced`, true);
    return;
}

async function setupUsers(client, userId) {
    const data = client.pg.users;
    if (!(await data.get(userId))) {
        await data.set(userId, {});
    };
    return;
}

async function setupGuilds(client, guildId) {
    const data = client.pg.guilds;
    if (!(await data.get(guildId))) {
        await data.set(guildId, {});
    };
    return;
}