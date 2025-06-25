const { readdirSync } = require("node:fs");

module.exports = (client) => {
    const data = [];
    
    console.log("[Handler] Open app-commands ...");
    
    const app_folders = readdirSync("./app-commands");
    
    for (const folder of app_folders) {
        const files = readdirSync("./app-commands/"+folder);
        
        for (const file of files) {
            const command = require("../app-commands/"+folder+"/"+file);
            command.category = folder;
            
            client.app_commands.set(command.data.name, command);
            data.push(command.data);
        }
    }
    
    console.log("[Handler] Loaded "+client.app_commands.size+" app-commands ✅");
    
    console.log("[Handler] Open commands ...");
    
    const folders = readdirSync("./commands");
    
    for (const folder of folders) {
        const files = readdirSync("./commands/"+folder);
        
        for (const file of files) {
            const command = require("../commands/"+folder+"/"+file);
            command.category = folder;
            
            client.commands.set(command.data.name, command);
            
            if (!command.private) data.push(command.data);
        }
    }
    
    client.on("ready", async() => {
        await client.application.commands.set(data).catch(console.error);
    });
    
    console.log("[Handler] Loaded "+client.commands.size+" commands ✅");
}