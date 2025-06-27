const { QuickMongo } = require("quick-mongo-super");

module.exports = async(client) => {
    client.db.on("connect", async() => {
        client.db = new QuickMongo(client.db, { name: "Clash" });
        
        const ping = await client.db.ping();
        
        console.log("[Database] Connected. ✅", `Read: ${ping.readLatency}ms | Write: ${ping.writeLatency}ms | Delete: ${ping.deleteLatency}ms`);
    });
    client.db.on("disconnect", () => console.log("[Database] Disconnected. ⚠️"));
    
    await client.db.connect();
}