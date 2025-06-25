const { readdirSync } = require("node:fs");

module.exports = (client) => {
    console.log("[Handler] Open events ...");
    
    const folders = readdirSync("./events");
    
    for (const folder of folders) {
        const files = readdirSync("./events/"+folder);
        
        for (const file of files) {
            const event = require("../events/"+folder+"/"+file);
            const name = file.split(".")[0];
            
            switch (folder) {
                case "Client": {
                    client.on(name, event.bind(null, client));
                }
            }
        }
    }
    
    console.log("[Handler] Loaded events ✅")
}