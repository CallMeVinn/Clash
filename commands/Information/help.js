const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require("discord.js");

const { readdirSync } = require("discord.js");

module.exports = {
    data: {
        type: 1,
        name: "help",
        description: "Sending help commands list",
        options: [{
            type: 3,
            name: "[commands]",
            description: "Input commands name",
        }],
    },
    async execute(i) {
        await i.deferReply();
        if (!i.args.length) {
            await helpMenu(i);
        }
        else {
            await helpCommands(i);
        }
    }
}

async function helpMenu(i) {
    const categories = readdirSync("./commands").filter(c => c !== "Developer");
    
    const buttons = [];
    const embed = new EmbedBuilder()
        .setColor(i.config.Color)
        .setTitle("Commands List")
        .setDescription(`Here my commands list, use \`/help [commands]\` for spesific commands information. Join [our discord server](${i.config.Discord}) for more information!`)
        .setThumbnail(i.guild.iconURL({ forceStatic: true, size: 512 }))
        .setFooter({ text: `Use the buttons below to show commands for each category.` })
    
    for (const category of categories) {
        const commands = i.client.commands.find(cmd => cmd.category == category).map(cmd => `${cmd.data.name}`).join(", ");
        
        embeds.addFields({ name: category, value: commands });
        
        buttons.push(
            new ButtonBuilder()
                .setCustomId(`help_${category}`)
                .setLabel(category)
                .setStyle(ButtonStyle.Primary)
        );
    }
    
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`help_back`)
                .setLabel("Back")
                .setStyle(ButtonStyle.Secondary),
            ...buttons
        );
    
    await i.editReply({ content: null, embeds: [embed], components: [row] });
    
    const msg = await i.fetchReply();
    return;
}

async function helpCommands(i) {
    const query = i.args.join(" ");
    
    const command = i.client.commands.get(query) || i.client.commands.find(c => c.aliases.includes(query));
    
    if (!command) return await i.editReply({ content: `Command with name \`${query}\` not found!`, flags: [MessageFlags.Ephemeral] });
    
    
}