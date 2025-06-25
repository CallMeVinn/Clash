const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { ClashClient: Client } = require("clashofclans.js");

class BotClient extends Client {
    constructor(...args) {
        super({
            allowedMentions: {
                parse: ["everyone", "roles", "users"],
                repliedUser: false,
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });
        
        process.on("unhandledRejection", (info) => console.error(info));
        process.on("uncaughtException", (info) => console.error(info));
        
        this.on("error", console.error);
        this.on("warn", console.info);
        
        this.coc = new ClashClient({
            email: process.env.ClashEmail,
            password: process.env.ClashPassword
        });
        
        this.app_commands = new Collection();
        this.commands = new Collection();
        this.components = new Collection();
        
        this.collect = new Collection();
        
        this.config = require("../config.js");
    }
    
    async start() {
        super.login(this.config.Token);
    }
}

module.exports = BotClient;