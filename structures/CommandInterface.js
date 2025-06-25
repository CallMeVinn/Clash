const { ChatInputCommandInteraction, Message } = require("discord.js");

class CommandInterface {
    constructor(data, args) {
        this.data = data;
        this.interaction = data instanceof ChatInputCommandInteraction ? data : null;
        this.message = data instanceof Message ? data : null;
        
        this.id = data.id;
        this.author = data instanceof Message ? data.author : data.user;
        this.channel = data.channel;
        this.guild = data.guild;
        this.member = data.member;
        this.createdAt = data.createdAt;
        this.createdTimestamp = data.createdTimestamp;
        
        this.client = data.client;
        this.config = data.client.config;
        this.coc = data.client.coc;
        
        this.setArgs(args);
    }
    get isInteraction() {
        return this.interaction instanceof ChatInputCommandInteraction;
    }
    get isMessage() {
        return this.message instanceof Message;
    }
    get deferred() {
        if (this.isInteraction) {
            return this.interaction.deferred;
        }
        if (this.msg) return true;

        return false;
    }
    async reply(data) {
        if (this.isInteraction) {
            this.msg = await this.interaction.reply(data);
            return this.msg;
        } else {
            this.msg = await this.message.reply(data);
            return this.msg;
        }
    }
    async editReply(data) {
        if (!data?.content) data.content = null;
        if (this.isInteraction) {
            if (this.msg) this.msg = this.interaction.editReply(data);
            return this.msg;
        } else {
            if (this.msg) this.msg = this.msg.edit(data);
            return this.msg;
        }
    }
    async deferReply(data) {
        if (this.isInteraction) {
            this.msg = await this.interaction.deferReply();
            return this.msg;
        } else {
            this.msg = await this.message.reply(data || "Sending command...");
            return this.msg;
        }
    }
    async followUp(data) {
        if (this.isInteraction) {
            await this.interaction.followUp(data);
        } else {
            this.msg = await this.message.reply(data);
        }
    }
    async fetchReply() {
        if (this.isInteraction) {
            return this.interaction.fetchReply();
        } else {
            return this.msg;
        }
    }
    setArgs(args) {
        if (this.isInteraction) {
            this.args = args.map((a) => a.value);
        } else {
            this.args = args;
        }
    }
}

module.exports = CommandInterface;