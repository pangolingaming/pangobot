const Discord = require("discord.js");

function adv(msg) {
    var rollArray = []
    rollArray.push(Math.floor(Math.random() * 20 + 1));
    rollArray.push(Math.floor(Math.random() * 20 + 1));

    var rollMax = Math.max(...rollArray)

    msg.reply(`you rolled a **${rollMax}**. (${rollArray[0]}, ${rollArray[1]})`)
}

function dis(msg) {
    var rollArray = []
    rollArray.push(Math.floor(Math.random() * 20 + 1));
    rollArray.push(Math.floor(Math.random() * 20 + 1));

    var rollMin = Math.min(...rollArray)
    
    msg.reply(`you rolled a **${rollMin}**. (${rollArray[0]}, ${rollArray[1]})`)
}

exports.adv = adv;
exports.dis = dis;