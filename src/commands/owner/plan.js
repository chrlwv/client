/** @format */

const { embed } = require("../../utils/Utils");

module.exports = class Plan extends Command {
  constructor() {
    super({
      name: "plan",
      aliases: ["gym", "workout"],
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
        `*triceps 'n biceps day*\n\n12x3 - [dumbbell curls](https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/bicep-curl.gif?resize=480:*)\n12x3 - [dumbbell x2 curls](https://i.gifer.com/7hh1.gif)\n12x3 - [dumbbell hummer curls](https://thumbs.gfycat.com/AlarmingVeneratedFawn-size_restricted.gif)\n\n----------------\n12x3 - [overhead triceps](https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/how-to-do-the-single-arm-dumbbell-tricep-extension.gif?crop=0.5732484076433121xw:1xh;center,top&resize=480:*)\n12x3 - [bench dip](https://thumbs.gfycat.com/FittingImpassionedAmethystinepython-max-1mb.gif)`,
        true
      )
      .addField(
        `Wednesday`,
        `*chest 'n back day*\n\n10x5 - [dumbbell bench](https://c.tenor.com/Vhhf9PFyFSwAAAAC/exercise-close-grip-bench-press.gif)\n10x5 - [fly dumbbell incline](https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/fly-dumbbell-incline.gif?resize=480:*)\n20x - [push ups](https://thumbs.gfycat.com/GlossySkinnyDuckbillcat-max-1mb.gif)\n\n----------------\n 10x3 - [dumbbell bent over rows](https://c.tenor.com/XehF1R8EzM4AAAAC/dumbbell-row.gif)\n 10x3 - [high pull](https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/workouts/2016/03/barbellhighpull-1457038270.gif)\n10x3 - [dumbbell back fly](https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/workouts/2016/03/dumbbellreversefly-1456949026.gif)`,
        true
      )
      .addField(
        `Friday`,
        `*the one and only leg day*\n\n10x3 - [romanian squats](https://thumbs.gfycat.com/DisfiguredScentedFoal-max-1mb.gif)\n10x4 - [normal squats](https://thumbs.gfycat.com/YellowishExhaustedDodo-size_restricted.gif)\n20x4 - [long rises](https://media0.giphy.com/media/ZgUWTHU1RzNHLyKBsv/giphy.gif?cid=790b7611a56f8dac863ed9fc0458b68b84a950b1e75aece3&rid=giphy.gif&ct=g)\n10x4 [squats with weights](https://hips.hearstapps.com/ame-prod-menshealth-assets.s3.amazonaws.com/main/assets/barbell-squat.gif?resize=480:*)`,
        true
      )
      .setFooter(
        "[] - except for these days, the rest of them are for restore"
      );

    return message.reply({ embeds: [emb] });
  }
};
