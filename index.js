const Client = require("./structures/Client");
const client = new Client();

const handlers = require("node:fs").readdirSync("./handler");

for (const file of handlers) {
    require("./handler/"+file)(client);
};

client.start();

module.exports = client;