const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

const spellsData = fs.readFileSync("./content/spells.yaml", "utf8");
const spellsList = yaml.safeLoad(spellsData);

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

  var spellNameFiltered = args[0].toLowerCase();
  var spell = spellsList[spellNameFiltered];

  /* Figure out whether spell is upcast or not - mostly for damage purposes. */

  var spellCastLevel = args[1];
  var spellBaseLevel = spell.spellLevel;
  var upCast = false;
  var upCastBy = 0;

    /* Is it upcast, and if so, by how much? */ 
  if (
    (spellCastLevel !== undefined) &&
    (parseInt(spellCastLevel) > parseInt(spellBaseLevel)) &&
    (parseInt(spellCastLevel) <= 9)
  ) {
    upCast = true;
    upCastBy = parseInt(spellCastLevel) - parseInt(spellBaseLevel);
  }

  /* Roll for damage */

  var damageRoll = spell.damage;

  if (upCast === true) {
    var spellDamageDiceType = spell.damage.split("d")[1];

    /* Add extra damage dice if it's upcast */

    var upCastDiceNumber =
      parseInt(spell.damageAtHigherLevels.split("d")[0]) * upCastBy +
      parseInt(spell.damage.split("d")[0]);

    damageRoll = upCastDiceNumber + "d" + spellDamageDiceType;
  }

  var damage = roll(damageRoll);

  /* Footer */

  var footer = "PangoBot is a good bot.";

  if (spell.source === "SRD") {
    footer = "Rules used under the terms of the OGL 1.0a.";
  }

  const castEmbed = new Discord.MessageEmbed()
    .setTitle(`${spell.spellName}`)
    .addFields(
      { name: "Spell level:", value: `${spell.spellLevel}`, inline: true },
      { name: "Upcast:", value: `${upCast}`, inline: true }
    )
    .setFooter(`${footer}`);

  /* Add damage inline field */

  if (spell.damage !== undefined) {
    castEmbed.fields.push({
      name: "Result",
      value: `**${damage.diceTotal}** ${
        spell.damageType
      } damage - ${damage.rollString} rolled (${damage.diceRoll.toString()}).`,
    });

    msg.reply(castEmbed);
  }
}

exports.cast = cast;
