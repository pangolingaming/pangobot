const Discord = require("discord.js");

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

  if (roll.number < 100) {
    let diceRollArray = [];

    for (n = 1; n <= roll.number; n++) {
      diceRollArray.push(Math.floor(Math.random() * roll.sides + 1));
    }

    let diceRoll = {
      rollString: rollString,
      diceRoll: diceRollArray,
      diceTotal: diceRollArray.reduce(function (a, b) {
        return a + b;
      }, 0),
    };
    return diceRoll;
  } else {
    return 0;
  }
}

exports.roll = roll;
exports.parseRoll = parseRoll;
