module.exports = (client) => {
    console.log("[Ready] Login as "+client.user.tag+" 🟢");
    
    client.user.setActivity("I was just born");
}