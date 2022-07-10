const {
    Schema,
    model
} = require("mongoose");

module.exports = model(
    "Tickets",
    new Schema({
        ticketId: {
            type: String,
            required: true
        },
        guildId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        mainMessageId: {
            type: String,
            required: true
        },
        panelMessageId: {
            type: String,
            required: true
        },
        closed: {
            type: Boolean,
            default: false
        },
    })
);