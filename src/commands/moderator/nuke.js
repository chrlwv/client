module.exports = class Nuke extends Command {
  constructor() {
    super({
      name: "nuke",
      aliases: ["nukechnl", "nukechannel"],
      description: "Nukes the channel.",
      usage: "",
      category: "Moderator",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: ["MANAGE_ROLES"],
      clientPerms: ["MANAGE_ROLES"],
    });
  }
  async exec(message) {
    await message.channel.clone().then((ch) => {
      ch.setParent(message.channel.parent.id);
      ch.setPosition(message.channel.position);
      ch.send('This channel got nuked.');
    });
    message.channel.delete();
  }
};