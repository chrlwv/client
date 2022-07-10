const tickets = require("../../models/Tickets");

module.exports = class ChannelDelete extends Event {
    constructor() {
        super({
            name: "channelDelete",
            once: false,
        });
    }
    async exec(channel) {
        const data = await this.client.getGuild({
            guildId: channel.guild.id
        });
        const ticket = await tickets.findOne({
            guildId: channel.guild.id,
            ticketId: channel.id,
        });

        if (ticket) {
            await ticket.delete();
        }

        if (data.transcript_channel && data.transcript_channel === channel.id) {
            data.transcript_channel = undefined;
            await data.save();
        }
        if (data.tickets_parent && data.tickets_parent === channel.id) {
            data.tickets_parent = undefined;
            await data.save();
        }
    }
};