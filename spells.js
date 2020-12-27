const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

const spellsData = fs.readFileSync("./content/spells.yaml", "utf8");
const spellsList = yaml.safeLoad(spellsData);

function spell(msg) {
  const args = msg.content.slice("!spell".length).trim().split(" ");

  console.log(args[0]);

  /* Make all names lowercase */

  var spellNameFiltered = args[0].toLowerCase();
  var spell = spellsList[spellNameFiltered];

  /* Ordinal fixing for spell levels */

  var spellLevelOrdinal = "";
  if (spell.spellLevel === "0") {
    spellLevelOrdinal = "cantrip";
  } else if (spell.spellLevel === "1") {
    spellLevelOrdinal = "1st-level";
  } else if (spell.spellLevel === "2") {
    spellLevelOrdinal = "2nd-level";
  } else if (spell.spellLevel === "3") {
    spellLevelOrdinal = "3rd-level";
  } else spellLevelOrdinal = spell.spellLevel.concat("th-level");

  /* Create standard first-line level and school description. */
  var spellFirstLine = "";
  var spellIsRitual = "";

  if (spell.ritual === true) {
    spellIsRitual = " (ritual)";
  }

  if (spell.spellLevel === "0") {
    spellFirstLine = "*" + spell.spellSchool + " cantrip*";
  } else
    spellFirstLine =
      "*" + spellLevelOrdinal + " " + spell.spellSchool + spellIsRitual + "*";

  /* Footer */
  if (spell.source === "SRD") {
    var footer = "Rules used under the terms of the OGL 1.0a.";
  } else var footer = "PangoBot is a good bot.";

  const spellEmbed = new Discord.MessageEmbed()
    .setTitle(`${spell.spellName}`)
    .addFields({ name: "Description", value: `${spell.description}` })
    .setDescription(`${spellFirstLine}`)
    .setFooter(`${footer}`);

  /* Handle cantrip (at higher levels) or upcasting for 1+ level spells */
  var spellProgression = "";

  if (spell.spellLevel === "0") {
    if (spell.cantripProgression === undefined) {
      ("");
    } else {
      spellProgression = spell.cantripProgression;
    }
  } else if (spell.atHigherLevels !== undefined) {
    spellProgression = spell.atHigherLevels;
  }

  if (spellProgression === "") {
  } else {
    spellEmbed.fields.push({
      name: "At Higher Levels:",
      value: `${spellProgression}`,
    });
  }

  msg.reply(spellEmbed);
}

exports.spell = spell;
