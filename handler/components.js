const { readdirSync } = require("node:fs");

module.exports = (client) => {
    const amount = [];
    
    console.log("[Handler] Open components ...");
    
    const folders = readdirSync("./components");
    
    for (const folder of folders) {
        const files = readdirSync("./components/"+folder);
        
        for (const file of files) {
            const componen = require("../components/"+folder+"/"+file);
            
            client.components.set(componen.customId, componen);
            
            amount.push(file);
        }
    }
    
    console.log("[Handler] Loaded "+(amount.length)+" components file ✅");
}