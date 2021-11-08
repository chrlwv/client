/** @format */

const Topgg = require(`@top-gg/sdk`);
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = class Vote extends Command {
  constructor() {
    super({
      name: "vote",
      aliases: ["topgg"],
      description:
        "<:topggvote:806573769485320312> Vote Charliewave on top.gg website.",
      usage: "",
      category: "<:charliewave_general:771633361340727336> Misc",
      ownerOnly: false,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
    const api = new Topgg.Api(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkwMjkzNzAxMDEwMzI3NTU4MSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjM2NDA2NjkxfQ.MRmkBLYUg7OtbDNQ42TqVthvx-EIlCJ1-8n89pP7noo"
    );

    const buttonVote = new MessageButton()
      .setURL(`https://top.gg/bot/${this.client.user.id}}/vote`)
      .setLabel("Vote")
      .setStyle("LINK");

    const row = new MessageActionRow().addComponents(buttonVote);

    api.hasVoted(message.author.id).then((votes) => {
      if (votes == false) {
        message.reply(
          `It looks like you didn't vote today. Click down below on the button to vote now.`,
          { components: [row] }
        );
      } else {
        message.reply(
          "You've already submitted a vote today. Try again later."
        );
      }
    });
  }
};
