#!/usr/bin/env node

const stats = require("./stats");
const dice = require("./dice");
const conditions = require("./conditions.js");
const spells = require("./spells.js");
const cast = require("./cast.js");
const rolls = require("./rolls.js");
const help = require("./help.js");
const equipment = require("./equipment.js");

const Discord = require("discord.js");
const { rollDiceFromMessageContent } = require("./rolls");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content === "!stats") {
    stats.command(msg);
  }

  if (msg.content === "!adv") {
    dice.adv(msg);
  }

  if (msg.content === "!dis") {
    dice.dis(msg);
  }

  if (msg.content.startsWith("!roll")) {
    rolls.rollDiceFromMessageContent(msg);
  }

  if (msg.content.startsWith("!condition")) {
    conditions.condition(msg);
  }

  if (msg.content.startsWith("!spell")) {
    spells.spell(msg);
  }

  if (msg.content.startsWith("!cast")) {
    cast.cast(msg);
  }

  if (msg.content.startsWith("!help")) {
    help.help(msg);
  }

  if (msg.content.startsWith("!equipment")) {
    equipment.equipment(msg);
  }

});

client.login(process.env.DISCORD_TOKEN);
