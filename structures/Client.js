const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { Client: ClashClient } = require("clashofclans.js");
const { QuickMongoClient } = require("quick-mongo-super");

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
        
        this.coc = new ClashClient();
        
        this.app_commands = new Collection();
        this.commands = new Collection();
        this.components = new Collection();
        
        this.collect = new Collection();
        
        this.config = require("../config.js");
        
        this.db = new QuickMongoClient(this.config.MongoUri);
    }
    
    async start() {
        super.login(this.config.Token);
        
        this.coc.on("error", console.error);
        this.coc.login({
            email: process.env.ClashEmail,
            password: process.env.ClashPassword
        });
    }
}

module.exports = BotClient;