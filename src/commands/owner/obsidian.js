const fs = require("fs");

const {
  stripIndents
} = require("common-tags");

module.exports = class Obsidian extends Command {
  constructor() {
    super({
      name: "obsidian",
      aliases: ["todo"],
      description: "Obsidian integration command",
      usage: "",
      category: "Owner",
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
    const splice = (s) => (s.length > 1999 ? `${s.substring(0, 1980)}...` : s);

    fs.readFile(__dirname + "/../../../TODO.md", "utf8", (err, data) => {
      if (err) throw err;

      try {
        message.reply(stripIndents `\`\`\`\n${splice(data)}\n\`\`\``);
      } catch (err) {
        console.log(err.message);
      }
    });
  }
};