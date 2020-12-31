const Discord = require("discord.js");
const fs = require("fs");
const yaml = require("js-yaml");

const spellsData = fs.readFileSync("./content/spells.yaml", "utf8");
const spellsList = yaml.safeLoad(spellsData);

const typeIcons = {
  acid: ":lemon:",
  alarm: ":bell:",
  animal: ":bear:",
  animate: ":broom:",
  antimagic: ":cross:",
  bludgeoning: ":hammer:",
  buff: ":muscle:",
  charm: ":heart_eyes:",
  cold: ":snowflake:",
  debuff: ":drop_of_blood:",
  disguise: ":disguised_face:",
  divination: ":crystal_ball:",
  fire: ":fire:",
  force: ":magic_wand:",
  healing: ":adhesive_bandage:",
  lightning: ":cloud_lightning:",
  lock: ":locked:",
  message: ":envelope:",
  move: ":right_arrow:",
  necrotic: ":skull:",
  necromancy: ":skull:",
  piercing: ":dagger:",
  poison: ":snake:",
  psychic: ":brain:",
  radiant: ":star2:",
  restrain: ":web:",
  shield: ":shield:",
  slashing: ":axe:",
  speed: ":fast_forward:",
  thunder: ":boom",
  travel: ":world_map:",
    
};

const dndDamageTypes = ['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder']

function parseRoll(rollString) {
  const roll = rollString.split("d");
  return {
    number: parseInt(roll[0]),
    sides: parseInt(roll[1]),
  };
}

function roll(rollString) {
  const roll = parseRoll(rollString);

  var diceRollArray = [];

  for (n = 1; n <= roll.number; n++) {
    diceRollArray.push(Math.floor(Math.random() * roll.sides + 1));
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

  /* Check for concentration - this will be used in duration later */

  const concentration = spell.concentration ? ":regional_indicator_c: " : "";

  /* Figure out whether spell is upcast or not - mostly for damage purposes. */
  let spellCastLevel = parseInt(args[1]);
  if (!Number.isInteger(spellCastLevel)) {
    spellCastLevel = spell.spellLevel;
  }
  const spellBaseLevel = parseInt(spell.spellLevel);

  var upCast = false;
  var upCastBy = 0;

  /* Is it upcast, and if so, by how much? */
  if (
    spellCastLevel !== undefined &&
    spellCastLevel > spellBaseLevel &&
    spellCastLevel <= 9
  ) {
    upCast = true;
    upCastBy = spellCastLevel - spellBaseLevel;
  }

  /* Roll for damage */
  if (spell.damage) {
    var damageRoll = spell.damage;

    if (upCast === true) {
      var spellDamageDice = parseRoll(spell.damage);

      /* Add extra damage dice if it's upcast */
      var higherLevelsDice = parseRoll(spell.damageAtHigherLevels);
      var upCastDiceNumber =
        higherLevelsDice.number * upCastBy + spellDamageDice.number;

      damageRoll = upCastDiceNumber + "d" + spellDamageDice.sides;
    }

    var damage = roll(damageRoll);
  }

  /* Footer */

  var footer = "PangoBot is a good bot.";

  if (spell.source === "SRD") {
    footer = "Rules used under the terms of the OGL 1.0a.";
  }

  /* Set spell type and damage type(s). First spell type determines the icon in the title. */

  var typeIcon = typeIcons[spell.spellType[0]] || "";
  let damageTypes = [];
   for (i = 0; i < spell.spellType.length; i++) {
     if (dndDamageTypes.includes(spell.spellType[i])) {
       damageTypes.push(spell.spellType[i])
     }
   }

  const castEmbed = new Discord.MessageEmbed()
    .setTitle(`${typeIcon} ${spell.spellName} ${typeIcon}`)
    .addFields(
      {
        name: "Spell level:",
        value: `${spell.spellLevel === "0" ? "cantrip" : spell.spellLevel}`,
        inline: true,
      },
      { name: "Spell school:", value: `${spell.spellSchool}`, inline: true },
      {
        name: "Casting time:",
        value: `${spell.castingTime}  ${spell.ritual ? "(ritual)" : ""}`,
        inline: true,
      },
      { name: "Range:", value: `${spell.range}`, inline: true }
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

  /* Add duration and concentration if not instantaneous */

  if (spell.duration !== "Instantaneous") {
    castEmbed.fields.push({
      name: "Duration:",
      value: `${concentration}${spell.duration}`,
      inline: true,
    });
  }

  /* Add description field (also if spell doesn't deal damage) */
  var spellDescription = spell.description;
  if (spellDescription.length > 1000) {
    spellDescription = spellDescription.substring(0, 1000) + " ...";
  }
  if (args.includes("desc") || spell.damage === undefined) {
    castEmbed.fields.push({
      name: "Spell description:",
      value: spellDescription,
    });
  }

  /* Add upcast description if spell doesn't deal damage and it is upcast */

  if (spell.damage === undefined && upCast && spell.atHigherLevels) {
    castEmbed.fields.push({
      name: "At Higher Levels:",
      value: spell.atHigherLevels,
    });
  }

  /* Add damage inline field. Turn damagetypes into a longer string if needed. */
  let damageTypeString
  
  if (damageTypes.length > 1) {
    damageTypeString = damageTypes.toString().replace(',', ' or ')
  } else damageTypeString = damageTypes[0]

  if (spell.damage) {
    castEmbed.fields.push({
      name: "Result",
      value: `**${damage.diceTotal}** ${damageTypes} damage - ${
        damage.rollString
      } rolled (${damage.diceRoll.toString()}).`,
    });
  }
  msg.reply(castEmbed);
}

exports.cast = cast;
