const Discord = require("discord.js");
const util = require("node:util");

module.exports = {
    data: {
        type: 1,
        name: "eval",
        description: "Executes javascript code"
    },
    private: true,
    async execute(i) {
        await i.deferReply();
        
        var code = i.args.join(" ");
        if (!code) code = "new (class Code { constructor() { this.required = true } })()";
        
        const embed = new Discord.EmbedBuilder();
        
        try {
            await generate(i, code, embed);
        }
        catch(error) {
            await failed(i, embed, error);
        }
    }
}

async function generate(i, code, embed) {
    let evaled = await eval(code);
    
    evaled = clean(evaled);
    
    embed.setColor("Green")
        .setTitle("Response[CODE]")
        .setDescription(`\`\`\`js\n${evaled}\`\`\``);
    
    await i.editReply({ content: null, embeds: [embed] });
    return;
}

async function failed(i, embed, error) {
    embed.setColor("Red")
        .setTitle("Response[ERROR]")
        .setDescription(`\`\`\`js\n${clean(error)}\`\`\``);
    
    await i.editReply({ content: null, embeds: [embed] });
    return;
}

function clean(code) {
    if  (typeof code === "string") {
        return code
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else {
        return util.inspect(code, { depth: 0 });
    }
};