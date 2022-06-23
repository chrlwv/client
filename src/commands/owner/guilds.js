const {
  MessageActionRow,
  MessageButton,
  MessageEmbed
} = require("discord.js");

module.exports = class Guilds extends Command {
  constructor() {
    super({
      name: "guilds",
      aliases: ["servers"],
      description: "Guilds command",
      usage: "",
      category: "Owner",
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message, args, data) {
    const backId = "back";
    const forwardId = "forward";
    const backButton = new MessageButton({
      style: "SECONDARY",
      label: "Back",
      customId: backId,
    });
    const forwardButton = new MessageButton({
      style: "SECONDARY",
      label: "Forward",
      customId: forwardId,
    });

    const {
      author,
      channel
    } = message;
    const guilds = [...this.client.guilds.cache.values()];

    const generateEmbed = async (start) => {
      const current = guilds.slice(start, start + 10);

      return new MessageEmbed({
        title: `Showing guilds ${start + 1}-${start + current.length} out of ${
          guilds.length
        }`,
        fields: await Promise.all(
          current.map(async (guild) => ({
            name: guild.name,
            value: `**ID:** ${guild.id}\n**Owner:** ${
              (
                await guild.fetchOwner()
              ).user.tag
            }`,
          }))
        ),
        color: 0x36393e,
      });
    };

    const canFitOnOnePage = guilds.length <= 10;
    const embedMessage = await channel.send({
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage ?
        [] :
        [new MessageActionRow({
          components: [forwardButton]
        })],
    });
    if (canFitOnOnePage) return;

    const collector = embedMessage.createMessageComponentCollector({
      filter: ({
        user
      }) => user.id === author.id,
    });

    let currentIndex = 0;
    collector.on("collect", async (interaction) => {
      interaction.customId === backId ?
        (currentIndex -= 10) :
        (currentIndex += 10);
      await interaction.update({
        embeds: [await generateEmbed(currentIndex)],
        components: [
          new MessageActionRow({
            components: [
              ...(currentIndex ? [backButton] : []),
              ...(currentIndex + 10 < guilds.length ? [forwardButton] : []),
            ],
          }),
        ],
      });
    });
  }
};