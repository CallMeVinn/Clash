const CommandInterface = require("../../structures/CommandInterface.js");

module.exports = async(client, interaction) => {
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
    
    command.execute(
        new CommandInterface(interaction, args)
    );
    
    if (interaction.user.id != client.config.DeveloperId) console.log(`[CommandUsage] ${command.data.name} | ${interaction.user.username} - ${interaction.user.id} | ${interaction.guild.name} - ${interaction.guildId}`);
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