const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, MessageFlags } = require("discord.js");

const { readdirSync } = require("node:fs");

module.exports = {
    data: {
        type: 1,
        name: "help",
        description: "Sending help commands list",
        options: [{
            type: 3,
            name: "command-name",
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
        .setDescription(`Here my commands list, use \`/help [command-name]\` for spesific commands information. Join [our discord server](${i.config.Discord}) for more information!`)
        .setThumbnail(i.guild.iconURL({ forceStatic: true, size: 128 }))
        .setFooter({ text: `Use the buttons below to show commands for each category.` })
    
    for (const category of categories) {
        const commands = i.client.commands.filter(cmd => cmd.category == category).map(cmd => `${cmd.data.name}`).join(", ");
        
        embed.addFields({ name: category, value: commands });
        
        buttons.push(
            new ButtonBuilder()
                .setCustomId(`help_${category}`)
                .setLabel(category)
                .setStyle(ButtonStyle.Primary)
        );
    }
    
    await i.editReply({ content: null, embeds: [embed], components: [new ActionRowBuilder().addComponents(buttons)] });
    
    await clickButtonCollector(i, embed, buttons);
    return;
}

async function helpCommands(i) {
    const query = i.args.join(" ");
    
    const command = i.client.commands.get(query) || i.client.commands.find(c => c.aliases.includes(query));
    
    const embed = new EmbedBuilder();
    
    if (!command) return await i.editReply({ content: null, embeds: [embed.setColor("Red").setDescription(`Command with name \`${query}\` not found!`)], flags: [MessageFlags.Ephemeral] });
    
    embed.setColor(i.config.Color)
        .setTitle(command.data.name)
        .setDescription(command.data.description);
    
    if (command.data.options) {
        embed.addFields({ name: "Arguments", value: `${command.data.options.map(o => `[\`${o.name}\`] - ${o.description}`)}` });
    }
    
    await i.editReply({ content: null, embeds: [embed] });
    return;
}

async function clickButtonCollector(i, embed, buttons) {
    const message = await i.fetchReply();
    
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

    var iButtons = [
        new ButtonBuilder()
            .setCustomId("help_back")
            .setLabel("Back")
            .setStyle(ButtonStyle.Secondary),
        ...buttons,
    ];

    collector.on("collect", async interaction => {
        await interaction.deferUpdate();
        iButtons = iButtons.map(button => button.setDisabled(false));

        if (interaction.customId === "help_back") {
            await interaction.editReply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(buttons)] });
            return;
        }

        const category = interaction.customId.replace("help_", "");
        const commands = i.client.commands.filter(c => c.category === category);

        const iEmbed = new EmbedBuilder()
            .setColor(i.config.Color)
            .setTitle(`${category} [${commands.size}]`)
            .setDescription(commands.map(c => `\`${c.data.name}\` - ${c.data.description}`).join("\n"))
            .setFooter({ text: `Use the buttons below to switch.` });

        iButtons = iButtons.map(
            button => {
                if (button.data.custom_id === interaction.customId) button.setDisabled(true);
            return button;
            }
        );
        

        await interaction.editReply({ embeds: [iEmbed], components: [new ActionRowBuilder().addComponents(iButtons)] }).catch(_=> void 0);
        
        collector.resetTimer({ time: 60000*5 });
    });

    collector.on("end", () => {
        if (!message) return;
        const oldButtons = buttons.map(button => button.setStyle(ButtonStyle.Secondary).setDisabled(true));
        const action = new ActionRowBuilder().addComponents(...oldButtons);

        message.edit({ embeds: [embed.setFooter({ text: `Button automatically disabled after 5 minutes inactive.` })], components: [action] }).catch(o_O => void 0);
    });
}