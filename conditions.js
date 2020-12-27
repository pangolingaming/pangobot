const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

const conditionsData = fs.readFileSync("./content/conditions.yaml", "utf8");
const conditionsList = yaml.safeLoad(conditionsData);

function condition(msg) {
  const args = msg.content.slice("!condition".length).trim().split(" ");

  console.log(args);
  var condition = conditionsList.conditions[args[0]];

  var content = "";
  if (condition == "exhaustion") {
  } else {
      content = condition.content
  }
    const conditionEmbed = new Discord.MessageEmbed()
      .setTitle(`${condition.name}`)
      .setDescription(`${content}`);

  msg.reply(conditionEmbed);
}

exports.condition = condition;
