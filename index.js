#!/usr/bin/env node

const stats = require("./stats");
const dice = require("./dice");
const conditions = require("./conditions.js");
const spells = require("./spells.js")
const cast = require("./cast.js")

const Discord = require("discord.js");
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

  if (msg.content.startsWith("!condition")) {
    conditions.condition(msg);
  }

  if (msg.content.startsWith("!spell")) {
    spells.spell(msg);
  }

  if (msg.content.startsWith('!cast')) {
    cast.cast(msg);
  }
});

client.login(process.env.TOKEN);
