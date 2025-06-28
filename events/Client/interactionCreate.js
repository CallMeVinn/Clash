const { EmbedBuilder } = require("discord.js");
const CommandInterface = require("../../structures/CommandInterface.js");

module.exports = async(client, interaction) => {
    
    await setupUsers(client, interaction.userId);
    await setupGuilds(client, interaction.guildId);

    if (interaction.isAutocomplete() || interaction.isButton() || interaction.isModalSubmit() || interaction.isStringSelectMenu()) return await componentExecute(client, interaction);
    
    if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) return await contextMenuExecute(client, interaction);
    
    if (!interaction.isChatInputCommand()) return;
    
    const botPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    const missingPermissions = [];

    for (const perm of botPermissions) {
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(perm)) missingPermissions.push(perm);
    }

    if (missingPermissions.length > 0) {
        const content = `The bot doesn't have one of these permissions \`${missingPermissions.join(", ")}\`.\nPlease double check them in your server role & channel settings.\n\nServer: **${interaction.guild.name}**`;

        const dmChannel = interaction.user.dmChannel || await interaction.user.createDM();

        return dmChannel.send({ content });
    }
    
    const args = interaction.options.data;
    const command = client.commands.get(interaction.commandName);
    
    if (!command) return;
    
    await sendIntro(client, interaction);
    command.execute(
        new CommandInterface(interaction, args)
    );
    
    if (interaction.user.id != client.config.DeveloperId) console.log(`[CommandUsage] ${command.data.name} | ${interaction.user.username} - ${interaction.user.id} | ${interaction.guild.name} - ${interaction.guildId}`);
    
    if (!command.private) client.pg.add(`command_used.${command.data.name}`, 1);
}

async function componentExecute(client, interaction) {
    const componen = client.components.get(interaction.customId) || client.components.find(c => interaction.customId.startsWith(c.customId));
    
    if (!componen) {
        // Auto complete
        return;
    }
    
    componen.execute(client, interaction);
    return;
}

async function contextMenuExecute(client, interaction) {
    const context = client.app_commands.get(interaction.commandName);
    
    if (!context) return;
    
    context.execute(client, interaction);
    return;
}

async function sendIntro(client, interaction) {
    const data = client.pg.users.get(interaction.user.id)
    
    if (data.introduced) return;
    
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
    
    interaction.channel.send({ embeds: [embed] });
    
    await client.pg.users.set(`${interaction.user.id}.introduced`, true);
    return;
}

async function setupUsers(client, userId) {
    const data = client.pg.users;
    if (!(await data.has(userId))) {
        await data.set(userId, {});
    };
    return;
}

async function setupGuilds(client, guildId) {
    const data = client.pg.guilds;
    if (!(await data.has(guildId))) {
        await data.set(guildId, {});
    };
    return;
}