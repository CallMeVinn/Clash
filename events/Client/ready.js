module.exports = async(client) => {
    console.log("[Ready] Login as "+client.user.tag+" 🟢");
    
    client.user.setActivity("I was just born");
    
    const app = await client.application.fetch();
    const emoji = await app.emojis.fetch();
    
    emoji.forEach(e => (client.config.Emojis[e.name] = e.toString()));
}