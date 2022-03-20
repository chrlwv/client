/** @format */

const { Client, Collection, Intents } = require("discord.js");
const { connect, connection: db } = require("mongoose");
const { resolve } = require("path");
const { sync } = require('glob');
const fs = require('fs');

require('./Command');
require('./Event');

module.exports = class Bot extends Client {
  constructor() {
    super({
      intents: Object.values(Intents.FLAGS),
      allowedMentions: {
        repliedUser: false,
      },
    });
    this.cooldowns = new Collection();
    this.commands = new Collection();
    this.events = new Collection();
    this.aliases = new Collection();
    this.owners = [
      '565960314970177556',
      '462294547855048714',
      '455004835658596363',
    ];
    this.openWeatherMapKey = 'ed251da67188d62057cd640eda4fdc77';
    this.hypixelKey = 'fd87b220-18c3-451e-be0c-8572e4186816';
    this.logger = require('../utils/Logger');

    this.database = {};
    this.guildsData = require('../models/Guilds');
    this.database.guilds = new Collection();
    this.usersData = require('../models/Users');
    this.database.users = new Collection();
    this.warningsData = require('../models/Warnings');
    this.database.warnings = new Collection();
    this.blacklistedData = require('../models/Blacklisted');
    this.database.blacklisted = new Collection();

    db.on('connected', async () =>
      this.logger.log(
        `Successfully connected to the database! (Latency: ${Math.round(
          await this.databasePing()
        )}ms)`,
        { tag: 'Database' }
      )
    );
    db.on('disconnected', () =>
      this.logger.error('Disconnected from the database!', { tag: 'Database' })
    );
    db.on('error', (error) =>
      this.logger.error(`Unable to connect to the database!\nError: ${error}`, {
        tag: 'Database',
      })
    );
    db.on('reconnected', async () =>
      this.logger.log(
        `Reconnected to the database! (Latency: ${Math.round(
          await this.databasePing()
        )}ms)`,
        { tag: 'Database' }
      )
    );
  }

  async findGuild({ guildID: guildId }, check) {
    if (this.database.guilds.get(guildId)) {
      return check
        ? this.database.guilds.get(guildId).toJSON()
        : this.database.guilds.get(guildId);
    } else {
      let guildData = check
        ? await this.guildsData.findOne({ guildID: guildId }).lean()
        : await this.guildsData.findOne({ guildID: guildId });
      if (guildData) {
        if (!check) this.database.guilds.set(guildId, guildData);
        return guildData;
      } else {
        guildData = new this.guildsData({ guildID: guildId });
        await guildData.save();
        this.database.guilds.set(guildId, guildData);
        return check ? guildData.toJSON() : guildData;
      }
    }
  }

  async loadDatabase() {
    return await connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async databasePing() {
    const cNano = process.hrtime();
    await db.db.command({ ping: 1 });
    const time = process.hrtime(cNano);
    return (time[0] * 1e9 + time[1]) * 1e-6;
  }

  async loadCommands() {
    const cmdFile = await sync(resolve('./src/commands/**/*.js'));
    cmdFile.forEach((filepath) => {
      const File = require(filepath);
      if (!(File.prototype instanceof Command)) return;
      const command = new File();
      command.client = this;
      this.commands.set(command.name, command);
      command.aliases.forEach((alias) => {
        this.aliases.set(alias, command.name);
      });
    });
  }

  async loadEvents() {
    const evtFile = await sync(resolve('./src/events/**/*.js'));
    evtFile.forEach((filepath) => {
      const File = require(filepath);
      if (!(File.prototype instanceof Event)) return;
      const event = new File();
      event.client = this;
      this.events.set(event.name, event);
      const emitter = event.emitter
        ? typeof event.emitter === 'string'
          ? this[event.emitter]
          : emitter
        : this;
      emitter[event.type ? 'once' : 'on'](event.name, (...args) =>
        event.exec(...args)
      );
    });
  }

  async getUserById(userId) {
    let user = await this.usersData.findOne({ userId: userId });
    const warnings = await this.warningsData.find({ userId: userId });

    if (!user) {
      user = await this.addUser(userId);
    }

    return {
      user,
      warnings: warnings,
    };
  }

  async addUser(userId) {
    const user = new this.usersData({ userId: userId });
    await user.save();
    return user;
  }

  async updateUserById(userId, data) {
    if (typeof data !== 'object') {
      throw Error("'data' must be an object");
    }

    const user = await this.getUserById(userId);

    if (!user) {
      await addUser(userId);
    }

    await this.usersData.findOneAndUpdate({ userId: userId }, data);
  }

  async removeUser(userId) {
    await this.usersData.findOneAndDelete({ userId: userId });
  }

  async getGuildById(guildId) {
    let guild = await this.guildsData.findOne({ guildId: guildId });

    if (!guild) {
      guild = await this.addGuild(guildId);
    }
    return guild;
  }

  async updateGuildById(guildId, settings) {
    if (typeof settings !== 'object') {
      throw Error("'settings' must be an object");
    }

    const guild = await this.getGuildById(guildId);

    if (!guild) {
      await this.addGuild(guildId);
    }

    await this.guildsData.findOneAndUpdate({ guildId: guildId }, settings);
  }

  async addGuild(guildId) {
    const guild = new this.guildsData({ guildId: guildId });
    await guild.save();
    return guild;
  }

  async removeGuild(guildId) {
    await this.guildsData.findOneAndDelete({ guildId: guildId });
  }

  async formatNumber(n) {
    return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  async list(arr, conj = 'and') {
    const len = arr.length;
    if (len === 0) return '';
    if (len === 1) return arr[0];
    return `${arr.slice(0, -1).join(', ')}${
      len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''
    }${arr.slice(-1)}`;
  }

  async randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async start(token) {
    await this.loadCommands();
    await this.loadEvents();
    await this.loadDatabase();
    return super.login(token);
  }
};
