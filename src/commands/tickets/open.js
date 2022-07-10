const tickets = require("../../models/Tickets");

module.exports = class OpenTicket extends Command {
	constructor() {
		super({
			name: "open",
			aliases: ["openticket", "open-ticket", "ticket-open", "ticketopen"],
			description: "Let you open a ticket.",
			usage: "",
			category: "Tickets",
			ownerOnly: false,
			cooldown: 3000,
			memberPerms: [],
			clientPerms: [],
		});
	}
	async exec(message, data) {
        let ticket = await tickets.find()
       
        message.reply(`tickets-module: offline <:offline_status:995788519245090886>\navailable tickets: ${ticket.length}`)
		
	}
};