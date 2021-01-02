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
  berry: ":strawberry:",
  bludgeoning: ":hammer:",
  buff: ":muscle:",
  celestial: ":angel:",
  charm: ":heart_eyes:",
  cold: ":snowflake:",
  dark: ":black_circle:",
  debuff: ":drop_of_blood:",
  disguise: ":disguised_face:",
  divination: ":crystal_ball:",
  door: ":door:",
  fear: ":scream:",
  fire: ":fire:",
  food: ":stew:",
  fog: ":fog:",
  force: ":magic_wand:",
  healing: ":adhesive_bandage:",
  hound: ":dog:",
  horse: ":horse:",
  house: ":house:",
  insect: ":insect:",
  language: ":speech_balloon:",
  light: ":bulb:",
  lightning: ":cloud_lightning:",
  lock: ":lock:",
  magic: ":magic_wand:",
  mending: ":sewing_needle:",
  message: ":envelope:",
  move: ":right_arrow:",
  necrotic: ":skull:",
  necromancy: ":skull:",
  piercing: ":dagger:",
  plant: ":leaves:",
  poison: ":snake:",
  psychic: ":brain:",
  radiant: ":star2:",
  rainbow: ":rainbow:",
  restrain: ":web:",
  revive: ":coffin:",
  rope: ":knot:",
  rock: ":rock:",
  scroll: ":scroll:",
  shield: ":shield:",
  silence: ":no_mouth:",
  slashing: ":axe:",
  sleep: ":sleeping:",
  speed: ":fast_forward:",
  stun: ":dizzy_face:",
  summon: ":o:",
  terrain: ":mountain:",
  thunder: ":boom",
  travel: ":world_map:",
  water: ":droplet:",
  weather: ":white_sun_rain_cloud:",
  web: ":spider_web:",
  wind: ":wind_blowing_face:",
};

const dndDamageTypes = [
  "acid",
  "bludgeoning",
  "cold",
  "fire",
  "force",
  "lightning",
  "necrotic",
  "piercing",
  "poison",
  "psychic",
  "radiant",
  "slashing",
  "thunder",
];

/* TBD: Spells with effect tables and super long spells. */

// Confusion
// Control Weather
// Blink
// Prismatic Spray
// Storm of Vengeance

/* TBD: Various special damage effects. */

// Delayed Blast Fireball
// Cantrip progression - beams (Eldritch Blast)
// Magic missile - beams
// Scorching Ray - beams
// Combine these two in array?
//
// Combine in array - type, damage, athigherlevels for each damage

/* Function to split the string into an array, removing "!cast" */

function splitString(msg) {
  return msg.content.slice("!cast".length).trim().split(" ");
}

/* Set spell type icons and create title. First spell type determines the icon in the title. */

function setTitle(spell) {
  var typeIcon = typeIcons[spell.spellType[0]] || "";
  const title = `${typeIcon} ${spell.spellName} ${typeIcon}`;
  return title;
}

/* Function to account for more than one damage type option */

function joinArrayWithCommas(damageTypes) {
  let damageTypeString
  if (damageTypes.length > 1) {
    let comma = (damageTypes.length > 2) ? "," : "";
    damageTypeString =
      damageTypes.slice(0, damageTypes.length - 1).join(", ") +
      comma +
      " or " +
      damageTypes[damageTypes.length - 1];
      return damageTypeString
  } else return damageTypes[0]
}

  /* If there are multiple damage types, add them all to an array, then join that array to make a comma separated string. */

  function addSpellDamageTypesToArray(spell) {
    let damageTypes = [];
    for (i = 0; i < spell.spellType.length; i++) {
      if (dndDamageTypes.includes(spell.spellType[i])) {
        damageTypes.push(spell.spellType[i]);
      }
    }
    return damageTypes;
  }


/* To calculate the dice from a roll string */

function parseRoll(rollString) {
  const roll = rollString.split("d");
  return {
    number: parseInt(roll[0]),
    sides: parseInt(roll[1]),
  };
}

/* To roll for damage */

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

/* Multiple attack rolls, separate damage (e.g. magic missile) */

function rollMultipleAttacks(attacks, rollString) {
  let attacksArray = [];
  for (i = 1; i <= attacks; i++) {
    attacksArray.push(roll(RollString));
  }
  return attacksArray;
}

/* Variables for upcasting and attack mod purposes. */
var upCast = false;
var upCastBy = 0;
let spellCastLevel;
let spellAttackMod;
let charLevel;
let short;

function cast(msg) {

  const args = splitString(msg);
  const spell = spellsList[args[0].toLowerCase()];

  /* Graceful exit if spell name doesn't match anything */

  if (spell === undefined) {
    return msg.reply(
      "I can't find this spell in my spellbook, and I know a lot of spells. Did you add underscores into the spell name? Did you make sure to use its SRD name?"
    );
  }

  const spellBaseLevel = parseInt(spell.spellLevel);

  /* Check for concentration and add a C symbol - this will be used in the duration field later */

  const concentration = spell.concentration ? ":regional_indicator_c: " : "";

  

  args.slice(1).forEach((arg) => {
    if (arg[0].match(/[Ll]/)) {
      spellCastLevel = parseInt(arg.substring(1));
    } else if (arg[0].match(/[+-]/)) {
      spellAttackMod = parseInt(arg);
    } else if(arg.match(/ *short\ */)) {
      short = true
    }
    
  });

  /* Figure out whether spell is upcast or not - mostly for damage purposes. */

  if (!Number.isInteger(spellCastLevel)) {
    spellCastLevel = spell.spellLevel;
  }

  /* Is it upcast, and if so, by how much? */
  if (
    spellCastLevel &&
    spellCastLevel > spellBaseLevel &&
    spellCastLevel <= 9
  ) {
    upCast = true;
    upCastBy = spellCastLevel - spellBaseLevel;
  }

  /* Roll for damage or healing or hpAffected or tempHP */

  if (spell.damage) {
    var effectRoll = spell.damage;

    if (upCast && spell.damage) {
      var spellEffectDice = parseRoll(effectRoll);

      /* Add extra damage dice if it's upcast and that provides extra damage. */

      if (spell.damageAtHigherLevels) {
        var higherLevelsDice = parseRoll(spell.damageAtHigherLevels);
        var upCastDiceNumber =
          higherLevelsDice.number * upCastBy + spellEffectDice.number;
        effectRoll = upCastDiceNumber + "d" + spellEffectDice.sides;
      }
    }

    var damage = roll(effectRoll);
  }

  /* Footer */

  var footer =
    spell.source === "SRD"
      ? `Rules used under the terms of the OGL 1.0a.`
      : "PangoBot is a good bot.";

  var damageTypes = joinArrayWithCommas(addSpellDamageTypesToArray(spell));

  const castEmbed = new Discord.MessageEmbed()
    .setTitle(`${setTitle(spell)}`)
    
    .setFooter(`${footer}`);

  /* Check for short messages, else add more fields */
  if (!short) {
    castEmbed.fields.push(
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
  )}

  /* Add upcast field only if the spell can be upcast. */

  if (upCast) {
    castEmbed.fields.push({
      name: "Upcast:",
      value: `Cast with spell level **${spellCastLevel}**, upcast by **${upCastBy}**.`,
      inline: true,
    });
  } else if (spell.spellLevel !== "0" && spell.atHigherLevels && !short) {
    castEmbed.fields.push({ name: "Upcast:", value: `No`, inline: true });
  }

  /* Add duration and concentration if not instantaneous. */

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

  if ((! spell.damage && ! spell.damageArray) && upCast && spell.atHigherLevels) {
    castEmbed.fields.push({
      name: "At Higher Levels:",
      value: spell.atHigherLevels,
    });
  }

  /* Add damage inline field. Turn damagetypes into a longer string if needed. Add modifier(s) to roll. */
  let damageTotal;

  if (spell.damage) {
    damageTotal = damage.diceTotal;
  }

  // Spell attack mod
  if (spellAttackMod) {
    damageTotal = damageTotal + spellAttackMod;
  }

  // Spells that innately add some amount (see False Life)

  let plusTotal = spell.plus;

  if (spell.plus) {
    damageTotal = damageTotal + spell.plus;

    // Only False Life gives a total bonus for each level above the first, I think, but let's add a way to handle that.

    if (upCast && spell.plusAtHigherLevels) {
      damageTotal = damageTotal + spell.plusAtHigherLevels * upCastBy;
      plusTotal = spell.plusAtHigherLevels * upCastBy + spell.plus;
    }
  }

  let spellRollText = spell.spellRollText || "damage";

  /* Sort the rolls and make a neater string */

  if (damage) {const diceRolls = damage.diceRoll.sort((a, b) => b-a).join(", ")}
  

  /* Add the damage string(s) to the message. Vampiric Touch restores half HP so that needs a separate indicator. */

  if (spell.damage) {
    castEmbed.fields.push({
      name: "Result",
      value: `**${damageTotal}** ${
        damageTypes === undefined ? "" : damageTypes
      } ${spellRollText}${
        damage.rollString === "0d0" ? "" : " - " + damage.rollString + " "
      }${
        damage.rollString === "0d0"
          ? ""
          : "rolled (" + diceRolls + ")"
      }${spellAttackMod ? " +  " + spellAttackMod : ""}${
        plusTotal && damage.rollString !== "0d0" ? " + " + plusTotal : ""
      }.${
        spell.spellName === "Vampiric Touch"
          ? " Regain **" + Math.floor(damageTotal / 2) + "** hp."
          : ""
      }`,
    });
  }
  msg.reply(castEmbed);
}

exports.cast = cast;
