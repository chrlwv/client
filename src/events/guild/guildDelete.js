/** @format */

module.exports = class guildDelete extends Event {
  constructor() {
    super({
      name: "guildDelete",
      once: false,
    });
  }
  async exec(guild) {
    await this.client.removeGuild(guild.id);
    this.client.logger.log(
      `${guild.name}(${guild.id}) removed me from their guild!`,
      {
        tag: "guildDelete",
      }
    );
  }
};
