module.exports = async(client) => {
    client.db.on("connect", async() => {
        const ping = await client.db.ping();
        console.log("[Database] Connected. ✅", `Read: ${ping.readLatency}ms | Write: ${ping.writeLatency}ms | Delete: ${ping.deleteLatency}ms`);
    });
    client.db.on("disconnect", () => console.log("[Database] Disconnected. ⚠️"));
    
    await client.db.connect();
}