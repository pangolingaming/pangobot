const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

const spellsData = fs.readFileSync("./content/spells.yaml", "utf8");
const spellsList = yaml.safeLoad(spellsData);

const damageIcons = { acid: ":lemon:", fire: ":fire:" };

function roll(rollString) {
  var diceNumber = rollString.split("d")[0];
  var diceSides = rollString.split("d")[1];

  diceRollArray = [];
  for (n = 1; n <= diceNumber; n++) {
    diceRollArray.push(Math.floor(Math.random() * diceSides + 1));
  }
  var diceRoll = {
    rollString: rollString,
    diceRoll: diceRollArray,
    diceTotal: diceRollArray.reduce(function (a, b) {
      return a + b;
    }, 0),
  };

  return diceRoll;
}

function cast(msg) {
  const args = msg.content.slice("!cast".length).trim().split(" ");

  const spell = spellsList[args[0].toLowerCase()];

  /* Figure out whether spell is upcast or not - mostly for damage purposes. */
  let spellCastLevel;
  if (Number.isInteger(parseInt(args[1])) === false) {
    spellCastLevel = spell.spellLevel;
  } else {
    spellCastLevel = parseInt(args[1]);
  }
  var spellBaseLevel = spell.spellLevel;
  var upCast = false;
  var upCastBy = 0;

  /* Is it upcast, and if so, by how much? */
  if (
    spellCastLevel !== undefined &&
    parseInt(spellCastLevel) > parseInt(spellBaseLevel) &&
    parseInt(spellCastLevel) <= 9
  ) {
    upCast = true;
    upCastBy = parseInt(spellCastLevel) - parseInt(spellBaseLevel);
  }

  /* Roll for damage */
  if (spell.damage) {
  var damageRoll = spell.damage;

  if (upCast === true) {
    var spellDamageDiceType = spell.damage.split("d")[1];

    /* Add extra damage dice if it's upcast */

    var upCastDiceNumber =
      parseInt(spell.damageAtHigherLevels.split("d")[0]) * upCastBy +
      parseInt(spell.damage.split("d")[0]);

    damageRoll = upCastDiceNumber + "d" + spellDamageDiceType;
  }

  var damage = roll(damageRoll)}

  /* Footer */

  var footer = "PangoBot is a good bot.";

  if (spell.source === "SRD") {
    footer = "Rules used under the terms of the OGL 1.0a.";
  }

  const castEmbed = new Discord.MessageEmbed()
    .setTitle(
      `${damageIcons[spell.damageType] ? damageIcons[spell.damageType] : ""} ${
        spell.spellName
      } ${damageIcons[spell.damageType] ? damageIcons[spell.damageType] : ""}`
    )
    .addFields(
      { name: "Spell school:", value: `${spell.spellSchool}`, inline: true },
      {
        name: "Spell level:",
        value: `${spell.spellLevel === "0" ? "cantrip" : spell.spellLevel}`,
        inline: true,
      }
    )
    .setFooter(`${footer}`);

  /* Add upcast field */

  if (upCast) {
    castEmbed.fields.push({
      name: "Upcast:",
      value: `Cast with spell level **${spellCastLevel}**, upcast by **${upCastBy}**.`,
      inline: true,
    });
  } else if (spell.spellLevel !== "0") {
    castEmbed.fields.push({ name: "Upcast:", value: `No`, inline: true });
  }

  /* Add description field (also if spell doesn't deal damage) */

  if (args.includes("desc") || spell.damage === undefined) {
    castEmbed.fields.push({
      name: "Spell description:",
      value: spell.description,
    });
  }

  /* Add upcast description if spell doesn't deal damage and it is upcast */

  if (spell.damage === undefined && upCast && spell.atHigherLevels) {
    castEmbed.fields.push({
      name: "At Higher Levels:", value: spell.atHigherLevels
    })
  }

  /* Add damage inline field */

  if (spell.damage) {
    castEmbed.fields.push({
      name: "Result",
      value: `**${damage.diceTotal}** ${spell.damageType} damage - ${
        damage.rollString
      } rolled (${damage.diceRoll.toString()}).`,
    });

    
  }
  msg.reply(castEmbed);
}

exports.cast = cast;
