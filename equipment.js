const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

const equipmentData = fs.readFileSync("./content/equipment.yaml", "utf8");
const equipmentList = yaml.safeLoad(equipmentData);

const donningAndDoffing = {
  light: { don: "1 minute", doff: "1 minute" },
  medium: { don: "5 minutes", doff: "1 minute" },
  heavy: { don: "10 minutes", doff: "5 minutes" },
  shield: { don: "1 action", doff: "1 action" },
};

/* Footer */
var footer = "Rules used under the terms of the OGL 1.0a. Additional descriptive text © Pangolin Gaming";

function coinExchange(cost) {
  let coin = "";
  if (cost < 1) {
    if (cost < 0.1) {
      cost = cost * 100;
      coin = " cp";
    } else {
      cost = cost * 10;
      coin = " sp";
    }
  } else coin = " gp";
  return `${cost.toLocaleString("en")}${coin}`;
}

function equipment(msg) {
  const args = msg.content.slice("!equipment".length).trim().split(" ");

  const item = equipmentList[args[0]];

  if (!item) {
    msg.reply(
      "Something went wrong. Most likely, I didn't recognise what item you were asking about."
    );
  } else {
    const equipmentEmbed = new Discord.MessageEmbed()
      .setTitle(`${item.name}`)
      .addFields(
        // Should fix this for items with cp and sp value

        {
          name: "Cost",
          value: `${coinExchange(item.cost)}`,
          inline: true,
        },
        {
          name: "Weight",
          value: `${item.weight ? item.weight + " lbs" : "—"} `,
          inline: true,
        }
      )
      .setDescription(`${item.description}`)
      .setFooter(`${footer}`);

    // Armor specific fields

    if (item.armor) {
      var shieldPlus = "";
      if (item.armor.type === "shield") {
        shieldPlus = "+";
      }
      equipmentEmbed.fields.push(
        { name: "Armor type", value: item.armor.type, inline: true },
        { name: "AC", value: `${shieldPlus}${item.armor.ac}`, inline: true },
        {
          name: "Don",
          value: `${donningAndDoffing[item.armor.type].don}`,
          inline: true,
        },
        {
          name: "Doff",
          value: `${donningAndDoffing[item.armor.type].doff}`,
          inline: true,
        }
      );
      if (item.armor.stealth_dis) {
        equipmentEmbed.fields.push({
          name: "Stealth",
          value: "Disadvantage",
          inline: true,
        });
      }
      if (item.armor.str) {
        equipmentEmbed.fields.push({
          name: "Strength",
          value: `Str ${item.armor.str}`,
          inline: true,
        });
      }
    }

    // Weapon specific fields

    if (item.weapon) {
      let properties;

      if (!item.weapon.properties) {
        properties = "—";
      } else {
        properties = item.weapon.properties
          .join(", ")
          .replace(/^(.)|\s+(.)/, (c) => c.toUpperCase());
      }

      let type;
      type = item.weapon.type
        .join(" ")
        .replace(/^(.)|\s+(.)/, (d) => d.toUpperCase());

      equipmentEmbed.fields.push(
        { name: "Weapon type", value: `${type} weapon`, inline: true },
        { name: "Properties", value: properties, inline: true },
        {
          name: "Damage",
          value: `${item.weapon.damage ? `${item.weapon.damage} ${item.weapon.damage_type}` : "—"}`,
          inline: true,
        }
      );

      if (item.weapon.properties.includes("versatile")) {
        equipmentEmbed.fields.push({
          name: "Two-handed damage",
          value: `${item.weapon.vers_damage} ${item.weapon.damage_type}`,
          inline: true,
        });
      }

      if (
        item.weapon.properties.includes("thrown") &&
        item.weapon.type.includes("melee")
      ) {
        equipmentEmbed.fields.push({
          name: "Thrown range",
          value: item.weapon.thrown_range,
          inline: true,
        });
      }

      if (item.weapon.properties.includes("special")) {
        equipmentEmbed.fields.push({
          name: "Special",
          value: item.weapon.special_text,
        });
      }
    }

    msg.reply(equipmentEmbed);
  }
}

exports.equipment = equipment;
