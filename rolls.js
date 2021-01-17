const Discord = require("discord.js");
const cast = require("./cast");
const dice = require("./dice");

function rollDiceFromMessageContent(msg) {
  const msgString = msg.content.replace("!roll", "");

  const resultsArray = [];
  const modArray = [];
  if (msgString === undefined || msgString.length < 2) {
    msg.reply(
      `Looks like you didn't tell me which dice to roll, or maybe you told me in a way I don't understand. Try '!roll 2d6+4'.`
    );
  } else {
    // Split into dice and mods, then remove whitespaces.

    const rollArray = msgString.replace(/\s+/g, "").split(/(?=[+-])/);
    for (i in rollArray) {
      rollArray[i] = rollArray[i]
        .replace(/^[+]/, "")
        .replace(/(^d)(\d+)/, "1d$2");
      console.log(rollArray[i]);
      if (rollArray[i].match(/\d*d\d+/)) {
        // Dice roll in xdy format

        resultsArray.push(dice.roll(rollArray[i]));
      } else if (rollArray[i].match(/\d+/)) {
        // Roll modifier (+ or -)

        modArray.push(parseInt(rollArray[i]));
      } else if (rollArray[i].match(/adv/)) {
        // Roll with advantage

        let advRoll = dice.roll("2d20");
        advRoll.diceTotal = Math.max(...advRoll.diceRoll);
        resultsArray.push(advRoll);
      } else if (rollArray[i].match(/dis/)) {
        // Roll with disadvantage
        let disRoll = dice.roll("2d20");
        disRoll.diceTotal = Math.min(...disRoll.diceRoll);
        resultsArray.push(disRoll);
        console.log(resultsArray);
      }
    }

    let modTotal = modArray.reduce((total, value) => total + value, 0);

    let totalValue =
      resultsArray.reduce((total, value) => total + value.diceTotal, 0) +
      modTotal;

    let rollStringForReply = rollArray.join(" + ");

    let resultString = "";
    for (i in resultsArray) {
      let rollSubString = "";
      rollSubString = rollSubString.concat(
        resultsArray[i].rollString,
        ": **",
        resultsArray[i].diceTotal,
        "** (",
        resultsArray[i].diceRoll
          .sort(function (a, b) {
            return b - a;
          })
          .join(", "),
        ")\n"
      );
      resultString = resultString.concat(rollSubString);
    }

    msg.reply(
      `you rolled ${rollStringForReply}. You got: **${totalValue}**.\n${resultString}`
    );
  }
}

exports.rollDiceFromMessageContent = rollDiceFromMessageContent;
