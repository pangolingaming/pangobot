const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

const equipmentData = fs.readFileSync("./content/equipment.yaml", "utf8");
const equipmentList = yaml.safeLoad(equipmentData);

/* Footer */
var footer = "Rules used under the terms of the OGL 1.0a.";

function equipment(msg) {
  const args = msg.content.slice("!equipment".length).trim().split(" ");
  console.log(args);

  const item = equipmentList[args[0]];

  if (!item) {
      msg.reply("Something went wrong. Most likely, I didn't recognise what item you were asking about.")
  } else {
  const equipmentEmbed = new Discord.MessageEmbed()
    .setTitle(`${item.name}`)
    .addFields(
      { name: "Cost", value: `${item.cost} gp`, inline: true },
      { name: "Weight", value: `${item.weight} lb.`, inline: true }
    )
    .setDescription(`${item.description}`)
    .setFooter(`${footer}`);

  if (item.armor) {
    equipmentEmbed.fields.push(
      { name: "\u200B", value: "Armor"},
      { name: "Type", value: item.armor.type, inline: true },
      { name: "AC", value: item.armor.ac, inline: true },
    );
    if (item.armor.stealth_dis) {
        equipmentEmbed.fields.push( {name: "Stealth", value: "Disadvantage", inline: true})
    }
  }

  msg.reply(equipmentEmbed);
  };
}

exports.equipment = equipment;
