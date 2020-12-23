const Discord = require("discord.js");

function roll4d6k3(statRoll) {
  var statSum = statRoll.slice(0, 3).reduce((a, b) => a + b);
  return statSum;
}

function abilMod(rollSum) {
  var mod = Math.floor((rollSum - 10) / 2);
  return mod;
}

function checkRoll(roll) {
  var modArray = [];
  var abilArray = [];
  roll.map((roll, index) => {
    var rollSum = roll4d6k3(roll);
    abilArray.push(rollSum);
    var rollMod = abilMod(rollSum);
    modArray.push(rollMod);
  });

  var modSum = modArray.reduce((a, b) => a + b, 0);
  var abilMax = Math.max(...abilArray);

  if (modSum >= 2 && abilMax >= 15) {
    return true;
  } else {
    return false;
  }
}

function diceRoll() {
  var statArray = rollSomeDice();

  while (checkRoll(statArray) == false) {
    statArray = rollSomeDice();
  }

  return statArray;
}

function rollSomeDice() {
  const statArray = [];
  var dice = 4;
  var stats = 6;

  var i;
  for (i = 0; i < stats; i++) {
    var j;
    var diceArray = [];
    for (j = 0; j < dice; j++) {
      diceArray.push(Math.floor(Math.random() * 6 + 1));
    }
    diceArray.sort(function (a, b) {
      return b - a;
    });
    statArray.push(diceArray);
  }

  statArray.sort(function (p, q) {
    var pSum = roll4d6k3(p);
    var qSum = roll4d6k3(q);
    return qSum - pSum;
  });

  return statArray;
}

function command(msg) {
  const dice = diceRoll();

  const rollResult = dice.map(function (roll) {
    var rollSum = roll4d6k3(roll);
    var rollMod = Math.floor((rollSum - 10) / 2);

    return `**${rollSum} (${rollMod >= 0 ? "+" : ""}${rollMod})** | ${roll}`;
  });

  const rollEmbed = new Discord.MessageEmbed()
    .setTitle("Ability Scores")
    .setURL("http://pangolingaming.com/dice")
    .setDescription("Roll four six-sided dice, keep the highest three results, and add together. Keep the roll only if at least one of the scores is **15** or higher, and the sum of the ability score modifiers comes to at least **+2**.")
    .addFields(
      { name: `${msg.author.username}'s results:`, value: rollResult },
    )

  msg.reply(rollEmbed);
}
exports.command = command;
