/** @format */

module.exports = class Instagram extends Command {
  constructor() {
    super({
      name: "instagram",
      aliases: ["insta", "inst", "instame"],
      description: "Get information on an Instagram account.",
      usage: "<user>",
      category: "<:charliewave_onlineglobe:779089847729389578> Searcher",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args) {
    if (!args[0]) return message.reply("WIP");
  }
};
