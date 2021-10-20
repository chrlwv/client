/** @format */

const fetch = require("node-fetch");
const { embed } = require("../../utils/Utils");

module.exports = class Weather extends Command {
	constructor() {
		super({
			name: "weather",
			aliases: ["meteo"],
			description: "Meteo informations about a submitted location.",
			usage: "<location>",
			category: "<:charliewave_general:771633361340727336> Misc",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, args, data) {
		const query = args.join(" ");

		if (!query) {
			return message.reply(
				`Inaccurate use of syntax.\n\`e.g. ${data.guild?.prefix}weather <location>\``
			);
		}

		const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
			query
		)}&appid=${this.client.openWeatherMapKey}&units=metric`;
		const dataWeather = await fetch(url).then((res) => res.json());

		if (dataWeather.cod === 401) {
			return message.reply('`openWeatherMap` API error, try again later.');
		}

		if (dataWeather.cod === "404") {
			return message.reply(`\`openWeatherMap 404 ERROR:\` Location ${query} cannot be found.`
			);
		}

		const main = dataWeather.weather[0].main;
		const desc = dataWeather.weather[0].description;
		const icon = dataWeather.weather[0].icon;
		const feelsLike = dataWeather.main.feels_like;
		const temp = dataWeather.main.temp;
		const windSpeed = dataWeather.wind.speed;
		const country = dataWeather.sys.country;

        let emb;
		emb = embed()
            .setColor(0x36393e)
			.addField(`**MAIN:**`, main, true)
			.addField(`**CURRENT:**`, desc, true)
			.addField(`**TEMPERATURE:**`, `${temp}°C`, true)
			.addField(
				`**FEELS LIKE:**`,
				`${feelsLike}°C`,
				true
			)
			.addField(
				`**WIND SPEED:**`,
				`${windSpeed}Km/h`,
				true
			)
			.addField(`**COUNTRY:**`, country, true)
			.setDescription(dataWeather.name)
			.setThumbnail(`https://openweathermap.org/img/wn/${icon}@2x.png`);

        return message.reply({ embeds: [emb] });
	}
};
