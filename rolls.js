const Discord = require("discord.js");
const cast = require("./cast");
const dice = require("./dice");

function rollDiceFromMessageContent(msg) {
  const msgString = msg.content.replace("!roll", "");

  const resultsArray = [];
  const modArray = [];
  if (msgString === undefined || msgString.length < 2) {
    msg.reply(
      `Looks like you didn't tell me which dice to roll. Try '!roll 2d6+4'.`
    );
  } else {
    // Split into dice and mods, then remove whitespaces.

    const rollArray = msgString.replace(/\s+/g, "").split(/(?=[+-])/);
    for (i in rollArray) {
      rollArray[i] = rollArray[i].replace(/^[+]/, "").replace(/^d/, "1d");
      if (rollArray[i].match(/\d*d\d+/)) {
        resultsArray.push(dice.roll(rollArray[i]));
      } else if (rollArray[i].match(/\d+/)) {
        modArray.push(parseInt(rollArray[i]));
      }
    }
    console.log(rollArray);
    console.log(resultsArray);
    console.log(modArray);

    let modTotal =  modArray.reduce((total, value) => total + value, 0);

    let totalValue =
      resultsArray.reduce((total, value) => total + value.diceTotal, 0) + modTotal;
     

    let resultString = "";
    for (i in resultsArray) {
      let rollSubString = "";
      rollSubString = rollSubString.concat(
        resultsArray[i].rollString,
        " (",
        resultsArray[i].diceRoll.sort(function(a,b) {return b-a}).join(", "),
        ")\n"
      );
      resultString = resultString.concat(rollSubString);
      console.log(resultString);
    }

    console.log(totalValue);
    msg.reply(`you rolled **${totalValue}**.\n${resultString}`);
  }
}

exports.rollDiceFromMessageContent = rollDiceFromMessageContent;
