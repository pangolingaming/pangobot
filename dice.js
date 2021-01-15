const Discord = require("discord.js");

/* Roll with advantage */

function adv(msg) {
    var rollArray = []
    rollArray.push(Math.floor(Math.random() * 20 + 1));
    rollArray.push(Math.floor(Math.random() * 20 + 1));

    var rollMax = Math.max(...rollArray)

    msg.reply(`you rolled a **${rollMax}**. (${rollArray[0]}, ${rollArray[1]})`)
}


/* Roll with disadvantage */

function dis(msg) {
    var rollArray = []
    rollArray.push(Math.floor(Math.random() * 20 + 1));
    rollArray.push(Math.floor(Math.random() * 20 + 1));

    var rollMin = Math.min(...rollArray)
    
    msg.reply(`you rolled a **${rollMin}**. (${rollArray[0]}, ${rollArray[1]})`)
}

/* To calculate the dice from a roll string */

function parseRoll(rollString) {
    const roll = rollString.split("d");
    return {
      number: parseInt(roll[0]),
      sides: parseInt(roll[1]),
    };
  }
  
  /* To roll for damage */
  
  function roll(rollString) {
    const roll = parseRoll(rollString);
    if(roll[0] < 100) {
    
    var diceRollArray = [];
  
    for (n = 1; n <= roll.number; n++) {
      diceRollArray.push(Math.floor(Math.random() * roll.sides + 1));
    }
    var diceRoll = {
      rollString: rollString,
      diceRoll: diceRollArray,
      diceTotal: diceRollArray.reduce(function (a, b) {
        return a + b;
      }, 0),
    };
  
    return diceRoll;
  } else return 0}

exports.roll = roll;
exports.parseRoll = parseRoll;  
exports.adv = adv;
exports.dis = dis;