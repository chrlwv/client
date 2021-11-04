module.exports = class Ready extends Event {
  constructor() {
    super({
      name: "ready",
      once: false,
    });
  }
  async exec() {
    const servers = this.client.guilds.cache.size;
    const users = this.client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    );
    const cachedUsers = this.client.users.cache.size;

    this.client.logger.log(
      `Interacted with ${servers.toLocaleString()} guilds and ${users.toLocaleString()} users (only ${cachedUsers.toLocaleString()} cached).`,
      { tag: "Info" }
    );
    this.client.logger.log(`Client: ${this.client.user.tag} is online.`, {
      tag: "Ready",
    });
    this.client.user.setActivity(`@${this.client.user.username} help`, {
      type: "WATCHING",
    });
    await this.client.loadInteractions();
  }
};
