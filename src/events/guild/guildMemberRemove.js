/** @format */
const { MessageAttachment } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = class guildMemberRemove extends Event {
  constructor() {
    super({
      name: "guildMemberRemove",
      once: false,
    });
  }
  async exec(member) {
    const mongoGuild = await this.client.getGuildById(member.guild.id);
    const leaveChannel = mongoGuild?.leave_event_module;

    const applyText = (canvas, text) => {
      const ctx = canvas.getContext("2d");

      let fontSize = 70;

      do {
        ctx.font = `${(fontSize -= 10)}px Sans`;
      } while (ctx.measureText(text).width > canvas.width - 256);

      return ctx.font;
    };

    if (leaveChannel) {
      if (!member.guild.channels.cache.find((ch) => ch.id === leaveChannel))
        return;

      const canvas = createCanvas(750, 256);
      const ctx = canvas.getContext("2d");

      const backgroundEvent = fs.readFileSync(
        path.join(__dirname, "..", "..", "assets", "background.png")
      );

      const background = await loadImage(backgroundEvent);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.font = applyText(canvas, `Goodbye,`);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`Goodbye,`, canvas.width / 3, canvas.height / 2.45);

      ctx.font = applyText(canvas, `${member.user.tag}!`);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        `${member.user.tag}`,
        canvas.width / 3,
        canvas.height / 1.55
      );

      ctx.beginPath();
      ctx.arc(130, 130, 100, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const avatar = await loadImage(
        member.user.displayAvatarURL({
          dynamic: true,
          size: 2048,
          format: "png",
        })
      );
      ctx.drawImage(avatar, 30, 30, 200, 200);

      const attachment = new MessageAttachment(
        canvas.toBuffer(),
        "left-image.png"
      );

      this.client.channels.cache
        .get(leaveChannel)
        .send({ conent: "guildMemberRemove", files: [attachment] });

      await this.client.removeUser(member.user.id, member.guild.id);
    }
  }
};
