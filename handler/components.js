const { readdirSync } = require("node:fs");

module.exports = (client) => {
    console.log("[Handler] Open components ...");
    
    const folders = readdirSync("./components");
    
    for (const folder of folders) {
        const files = readdirSync("./components/"+folder);
        
        for (const file of files) {
            const componen = require("../components/"+folder+"/"+file);
            
            client.components.set(componen.customId, componen);
        }
    }
    
    console.log("[Handler] Loaded components ✅");
}