const {
  formatArray,
  formatPerms
} = require("../../utils/Utils");
const {
  Collection,
  WebhookClient,
  MessageEmbed
} = require("discord.js");
const calculateUserXp = (xp) => Math.floor(0.1 * Math.sqrt(xp));

module.exports = class messageCreate extends Event {
  constructor() {
    super({
      name: "messageCreate",
      once: false,
    });
  }
  async exec(message) {
    const mentionRegPrefix = RegExp(`^<@!?${this.client.user.id}> `);
    const guild = await this.client.getGuildById(message.guild.id);
    const ignored_channels_const = guild?.ignored_channels;
    if (ignored_channels_const.includes(message.channel.id)) return;

    if (message.author.bot || !message.guild) return;
    const data = {};
    if (message.guild)
      data.guild = await this.client.findGuild({
        guildID: message.guild.id
      });
    const prefix = message.content.match(mentionRegPrefix) ?
      message.content.match(mentionRegPrefix)[0] :
      data.guild?.prefix;
    if (!message.content.startsWith(prefix)) return;
    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command =
      this.client.commands.get(cmd.toLowerCase()) ||
      this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
    if (command) {
      if (message.guild) {
        const memberCheck = command.memberPerms;
        if (memberCheck) {
          const missing = message.channel
            .permissionsFor(message.member)
            .missing(memberCheck);
          if (missing.length) {
            await message.channel.sendTyping();
            return message.reply(
              `You are missing \`${formatArray(
                missing.map(formatPerms)
              )}\` permission.`
            );
          }
        }
        const clientCheck = command.clientPerms;
        if (clientCheck) {
          const missing = message.channel
            .permissionsFor(message.guild.me)
            .missing(clientCheck);
          if (missing.length) {
            await message.channel.sendTyping();
            return message.reply(
              `I am missing \`${formatArray(
                missing.map(formatPerms)
              )}\` permission.`
            );
          }
        }
      }

      if (command.ownerOnly && !this.client.owners.includes(message.author.id))
        return;
      if (!this.client.cooldowns.has(command.name)) {
        this.client.cooldowns.set(command.name, new Collection());
      }

      if (!message.author.bot) {
        const {
          user
        } = await this.client.getUserById(message.author.id);
        const xp = Math.ceil(Math.random() * (1 * 5));
        const level = calculateUserXp(user.exp);
        const newLevel = calculateUserXp(user.exp + xp);
        const guild = await this.client.getGuildById(message.guild.id);

        if (newLevel > level) {
          if (guild.level_msg_module === true) {
            const msg = await message.reply(
              `<a:cheer:991753457813954600> Congratulations, you leveled up to level \`${newLevel}\`!`
            );
            setTimeout(() => {
              msg?.delete();
            }, 10000);
          }
        }

        await this.client.updateUserById(message.author.id, {
          exp: user.exp + xp,
        });
      }

      const guild = await this.client.getGuildById(message.guild.id);

      if (guild.uri_blocker_module === true) {
        function is_url(str) {
          let regexp =
            /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
          if (regexp.test(str)) {
            return true;
          } else {
            return false;
          }
        }

        if (is_url(message.content) === true) {
          if (message.member.hasPermission('MANAGE_MESSAGES')) return;
          message.delete();

          return message
            .reply(`Denied, you cannot send links on this server.`)
            .then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 2000);
            });
        }
      }

      const blacklistedUsers = await this.client.blacklistedData.find();

      if (blacklistedUsers) {
        const isBlacklisted = blacklistedUsers.find(
          (u) => u.userId === message.author.id
        );

        if (isBlacklisted) {
          return message.reply(
            'You have been blocked from using this bot.\nTry to conect with us on our website https://chrlwv.tech/'
          );
        }
      }

      const now = Date.now();
      const timestamps = this.client.cooldowns.set(command.name);
      const cdAmount = command.cooldown;
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cdAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(
            `You need to wait **${timeLeft.toFixed(2)}** seconds!`
          );
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cdAmount);
      try {
        await command.exec(message, args, data);
      } catch (err) {
        const splice = (s) =>
          s.length > 1500 ? `${s.substring(0, 1000)}...` : s;
        const webhookIntegration = new WebhookClient({
          id: process.env.ERROR_WEBHOOK_ID,
          token: process.env.ERROR_WEBHOOK_TOKEN,
        });
        if (!webhookIntegration) {
          return this.client.logger.error(`UNHANDLED ERROR\n\n${splice(err)}`, {
            tag: 'WebhookIntegration',
          });
        }

        const stack = err.stack || err;

        const embed = new MessageEmbed()
          .setTitle('An error occurred')
          .setDescription(`\`\`\`js\n${splice(stack)}\`\`\` `)
          .setColor(0x36393e);

        webhookIntegration.send({
          username: 'chrlwv.tech',
          avatarURL: 'https://japi.rest/discord/v1/user/902937010103275581/avatar?size=512',
          embeds: [embed],
        });

        this.client.logger.error(
          `An error occurred when trying to trigger MessageCreate event.\n\n${err}`, {
            tag: 'MessageError'
          }
        );
        return message.reply(
          `Oops, run into a critical error, please wait for a fix.`
        );
      }
    }
  }
};