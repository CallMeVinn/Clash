module.exports = {
    data: {
        type: 1,
        name: "ping",
        description: "Sending bot latency"
    },
    async execute(i) {
        await i.deferReply();
        
        const timestamp = await Date.now();
        
        await i.editReply(`Pong! **${timestamp - i.createdTimestamp}** ms`);
        return;
    }
}