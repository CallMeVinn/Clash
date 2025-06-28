const { EmbedBuilder } = require("discord.js");
const { execSync } = require("node:child_process");

module.exports = {
    data: {
        type: 1,
        name: "sh",
        description: "Command Line Interface"
    },
    private: true,
    async execute(i) {
        await i.deferReply();

        const cmd = i.args.join(" ") ?? "[unknown]";

        const embed = new EmbedBuilder().setColor("Green");

        try {
            const _execute = execSync(cmd);
            embed.setTitle(`\> ${cmd}`)
            embed.setDescription(`\`\`\`bash\n${_execute}\`\`\``);

            i.editReply({ embeds: [embed] });
        }
        catch(error) {
            embed.setColor("Red");
            embed.setDescription(`Cannot running shell commands: $ ${cmd}\`\`\`bash\n${error ?? "[Unknown Error!]"}\`\`\``);

            i.editReply({ embeds: [embed] });
        }
    }
}
