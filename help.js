const Discord = require("discord.js");

function help(msg) {
  const footer = "Rules used under the terms of the OGL 1.0a.";

  const helpEmbed = new Discord.MessageEmbed()
    .setTitle(`Help`)
    .setDescription(
      `I can help you with a bunch of stuff. Just try out one of the commands below:`
    )
    .addFields(
      {
        name: "!roll",
        value:
          'I can roll dice for you. Just try something like **"!roll 4d6 + 1d4 + 2"**.',
      },
      {
        name: "!cast",
        value: 'I can cast _most_ of the spells in the SRD. The syntax is **!cast <spell_name>**. \n\n To add your spellcasting modifier, just use **+4** or the like.\n You can upcast spells by adding **L** followed by the spell slot level you are using. \nIn order to get the full description of the spell, add **desc**. \nTo only get the damage dice roll, use **short**.\n\n Make sure to separate your arguments with spaces.',
      },
      {
        name: "!condition",
        value: 'I can tell you about all of the status conditions that can affect creatures. Just try **"!condition blinded"**.'
      },
      {
        name: "!stats",
        value: 'If you\'re creating a new character, I can roll your stats for you. I\'ll keep rolling until they are good enough to use! You can just type "!stats" to get me to roll your stats for you.'
      }
    )
    .setFooter(footer);

  msg.reply(helpEmbed);
}
exports.help = help;
