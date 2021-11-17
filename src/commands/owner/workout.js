/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Workout extends Command {
  constructor() {
    super({
      name: "workout",
      aliases: ["gym"],
      description: "Workout command",
      usage: "",
      category: "<:charliewave_ownership:771637500967124994> Owner",
      ownerOnly: true,
      cooldown: 3000,
      memberPerms: [],
      clientPerms: [],
    });
  }
  async exec(message) {
    let emb;
    emb = embed()
      .setColor(0x36393e)
      .setThumbnail(
        "https://img.icons8.com/external-wanicon-flat-wanicon/344/external-workout-daily-routine-wanicon-flat-wanicon.png"
      )
      .setTitle("Workout Plan")
      .addField(
        `Monday`,
        `*biceps & triceps day*\n\n10x4 - [curls](https://i.gifer.com/origin/06/0658156e77edcbea0c6adb5be36c7ab7.gif)\n10x4 - [double curls](https://i.gifer.com/7hh1.gif)\n10x4 - [hummer curls](https://thumbs.gfycat.com/AlarmingVeneratedFawn-size_restricted.gif)\n10x4 - [triceps](https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/how-to-do-the-single-arm-dumbbell-tricep-extension.gif?crop=0.5732484076433121xw:1xh;center,top&resize=480:*)`,
        true
      )
      .addField(
        `Wednesday`,
        `*chest day*\n\n10x5 - [dumbbell bench](http://www.lifetime60day.com/wp-content/uploads/2018/03/Dumbbell-Bench-Press-2.gif)\n20x - [push ups](https://c.tenor.com/gI-8qCUEko8AAAAC/pushup.gif)`,
        true
      )
      .addField(
        `Friday`,
        `*leg day*\n\n10x3 - [romanian squats](https://thumbs.gfycat.com/DisfiguredScentedFoal-max-1mb.gif) (ramat)\n10x4 - [normal squats](https://thumbs.gfycat.com/YellowishExhaustedDodo-size_restricted.gif)\n20x4 - [long rises](https://media0.giphy.com/media/ZgUWTHU1RzNHLyKBsv/giphy.gif?cid=790b7611a56f8dac863ed9fc0458b68b84a950b1e75aece3&rid=giphy.gif&ct=g)\n10x4 [squats with weights](https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/barbell-squat.gif?resize=480:*)`,
        true
      )
      .setFooter("[] - other days of the week are rest day");

    return message.reply({ embeds: [emb] });
  }
};
