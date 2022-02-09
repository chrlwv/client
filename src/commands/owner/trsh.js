/** @format */

module.exports = class Trsh extends Command {
  constructor() {
    super({
      name: "trsh",
      aliases: [],
      description: "Trsh command",
      usage: "",
      category: "<:charliewave_ownership:771637500967124994> Owner",
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    message.reply("ianis level 18 faceit");
  }
};
