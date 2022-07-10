const tickets = require("../../models/Tickets");

const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
} = require("discord.js");

module.exports = class ButtonPress extends Event {
    constructor() {
        super({
            name: "buttonPress",
            once: false,
        });
    }

    async exec(message, data) {
        if (message.customId === "open") {
            let ticket = await tickets.findOne({
                guildId: message.guild.id,
            });

            if (ticket) {
                return message.reply("You already have a ticket open!");
            }

            message.guild.channels
                .create(`ticket-${message.user.username}`, {
                    parent: data.tickets_parent ? data.tickets_parent : null,
                    topic: `${message.user.tag}`,
                    permissionOverwrites: [{
                            id: message.user.id,
                            allow: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL", "ATTACH_FILES"],
                            deny: ["SEND_MESSAGES"],
                        },
                        {
                            id: message.guild.roles.everyone,
                            deny: ["VIEW_CHANNEL"],
                        },
                    ],
                    type: "text",
                })
                .then(async (c) => {
                    data.modRoles.forEach(async (r) => {
                        await c.permissionOverwrites.edit(r, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true,
                            MANAGE_MESSAGES: true,
                            ATTACH_FILES: true,
                            ADD_REACTIONS: true,
                        });
                    });

                    message.reply(`Your ticket ${c} has been opened!`);

                    let ticket = await tickets.create({
                        ticketId: c.id,
                        guildId: message.guild.id,
                    });
                    await ticket.save();

                    let emb = new MessageEmbed()
                        .setColor(0x36393e)
                        .setAuthor(
                            message.member.tag,
                            message.user.displayAvatarURL({
                                size: 128,
                                format: "png",
                                animated: true,
                            })
                        )
                        .setDescription("Choose the ticket topic")
                        .setTimestamp();

                    const row = new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                        .setCustomId("topic")
                        .setPlaceholder("Choose topic")
                        .addOptions([{
                                label: "Server questions",
                                value: "questions",
                                emoji: "❓",
                            },
                            {
                                label: "Mute or ban appeal",
                                value: "appeal",
                                emoji: "🔇",
                            },
                            {
                                label: "Report an user",
                                value: "report",
                                emoji: "😡",
                            },
                            {
                                label: "Contact the server owner",
                                value: "owners",
                                emoji: "👑",
                            },
                        ])
                    );

                    let msg = await c.send({
                        content: `<@!${message.user.id}>`,
                        embeds: [emb],
                        components: [row],
                    });

                    ticket = await tickets.findOne({
                        guildId: message.guild.id,
                    });

                    ticket.mainMessageId = msg.id;
                    await ticket.save().catch((e) => console.log(e));

                    await msg.pin().then(() => {
                        c.bulkDelete(1);
                    });

                    const collector = msg.createMessageComponentCollector({
                        filter: (m) => m.user.id === message.user.id,
                        componentType: "SELECT_MENU",
                        time: 600000,
                    });

                    collector.on("collect", async (m) => {
                        let emb = new MessageEmbed()
                            .setColor(0x36393e)
                            .setAuthor(
                                message.member.username,
                                message.user.displayAvatarURL({
                                    size: 128,
                                    format: "png",
                                    animated: true,
                                })
                            )
                            .setDescription(i.values[0])
                            .setTimestamp();

                        const row = new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId("close")
                            .setLabel("Close ticket")
                            .setEmoji("🔒")
                            .setStyle("SECONDARY")
                        );

                        await msg.edit({
                            embeds: [emb],
                            components: [row],
                        });

                        c.permissionOverwrites
                            .edit(message.user.id, {
                                READ_MESSAGE_HISTORY: true,
                                SEND_MESSAGES: true,
                                VIEW_CHANNEL: true,
                                ADD_REACTIONS: true,
                                ATTACH_FILES: true,
                            })
                            .then((x) => {
                                x.edit({
                                    topic: `${message.user.tag} | ${m.values[0]}`
                                });
                            })
                            .catch((err) => {
                                this.client.logger.error(
                                    `An error occurred while editing the channel topic:\n ${
                    err.stack ? err + "\n\n" + err.stack : err
                  }`
                                );
                            });

                        m.reply("Now send the reason of the ticket **in one message**.");

                        const filter = (m) => m.author.id === message.user.id;

                        const awaitReason = await c
                            .awaitMessages({
                                filter,
                                max: 1,
                                time: 600000,
                                errors: ["time"]
                            })
                            .then(async (collected) => {
                                let reason = collected.first().content;
                                let emb = new MessageEmbed()
                                    .setColor(0x36393e)
                                    .setAuthor(
                                        message.member.username,
                                        message.user.displayAvatarURL({
                                            size: 128,
                                            format: "png",
                                            animated: true,
                                        })
                                    )
                                    .addField("Reason", reason)
                                    .setTimestamp();

                                await collected.first().delete();
                                i.deleteReply().catch((err) => {
                                    this.client.logger.error(
                                        `An error occurred while deleting the message:\n ${
                      err.stack ? err + "\n\n" + err.stack : err
                    }`
                                    );
                                });
                                await msg.edit({
                                    embeds: [emb],
                                });
                            })
                            .catch(async (collected) => {
                                if (collected.size === 0) {
                                   
                                    if (c.deleted) return ticket.delete();
                                    if (!c.deleted) {
                                        await ticket.delete();
                                        return c.delete().catch((err) => {
                                            this.client.logger.error(
                                                `An error occurred while deleting the channel:\n ${
                          err.stack ? err + "\n\n" + err.stack : err
                        }`
                                            );
                                        });
                                    }
                                }
                            });

                        await awaitReason;
                    });

                    collector.on("end", async (collected) => {
                        if (collected.size < 1) {
                            if (c.deleted) return ticket.delete();
                            if (!c.deleted) {
                                await ticket.delete();
                                return c.delete();
                            }
                        }
                    });
                });
        }

        if (message.customId === "close") {
            let ticket = await tickets.findOne({
                guildId: message.guild.id,
                ticketId: message.channel.id,
            });

            if (!message.member.permissions.has("MANAGE_GUILD")) {
                return message.reply('You must have \`MANAGE_GUILD\` permission or be alone in the voice channel to use this command!');
            }

            if (ticket.closed === true) {
                return message.reply('This ticket is already closed!');
            }

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("confirm")
                .setLabel("Close")
                .setStyle("DANGER"),
                new MessageButton()
                .setCustomId("cancel")
                .setLabel("Cancel")
                .setStyle("SECONDARY")
            );

            await message.reply({
                content: "Are you sure you want to close this ticket?",
                components: [row],
            });

            const filter = (m) => m.user.id === message.user.id;
            const collector = message.channel.createMessageComponentCollector({
                filter,
                componentType: "BUTTON",
                time: 10000,
            });

            collector.on("collect", async (m) => {
                if (m.customId === "confirm") {
                    let row = new MessageActionRow().addComponents(
                        new MessageButton()
                        .setCustomId("close")
                        .setLabel("Close ticket")
                        .setStyle("SECONDARY")
                        .setEmoji("🔒")
                        .setDisabled(true)
                    );

                    ticket.closed = true;
                    await ticket.save();
                    message.message.edit({
                        components: [row]
                    });
                    m.message.delete();
                    m.reply('The ticket has been closed!');

                    message.channel.members.forEach((m) => {
                        let perm = m.permissions.has("MANAGE_GUILD");
                        if (!perm && m.id !== ticket.userId) {
                            message.channel.permissionOverwrites.edit(m.id, {
                                VIEW_CHANNEL: false,
                                SEND_MESSAGES: false,
                            });
                        }
                    });

                    message.channel.permissionOverwrites
                        .edit(ticket.ticketId, {
                            SEND_MESSAGES: false,
                            VIEW_CHANNEL: false,
                        })
                        .then(async () => {
                            let emb = new MessageEmbed()
                                .setColor(0x36393e)
                                .setTitle("Ticket control panel")
                                .setTimestamp();

                            const row = new MessageActionRow().addComponents(
                                new MessageButton()
                                .setCustomId("reopen")
                                .setLabel("Reopen")
                                .setStyle("SUCCESS"),
                                new MessageButton()
                                .setCustomId("transcript")
                                .setLabel("Save")
                                .setStyle("PRIMARY"),
                                new MessageButton()
                                .setCustomId("delete")
                                .setLabel("Delete")
                                .setStyle("DANGER")
                            );

                            message.channel
                                .send({
                                    embeds: [emb],
                                    components: [row],
                                })
                                .then(async (m) => {
                                    let ticket = await tickets.findOne({
                                        ticketId: message.channel.id,
                                    });
                                    ticket.panelMessageId = m.id;
                                    await ticket.save();
                                });
                        });

                    collector.stop();
                }
                if (m.customId === "cancel") {
                    m.message.delete();
                    m.reply('Process cancelled!');
                    collector.stop();
                }
            });

            collector.on("end", (i) => {
                if (m.size < 1) {
                    message.edit('Process cancelled!');
                }
            });
        }

        if (message.customId === "delete") {

            if (!message.member.permissions.has("MANAGE_GUILD")) {
                return message.reply('You must have \`MANAGE_GUILD\` permission or be alone in the voice channel to use this command!');
            }
            message.reply("Deleting ticket...");

            message.channel.messages.fetch().then(async (messages) => {
                let b = messages
                    .filter((m) => m.author.bot !== true)
                    .map(
                        (m) =>
                        `${new Date(m.createdTimestamp).toLocaleString("en-GB")} - ${
                m.author.username
              }#${m.author.discriminator}: ${
                m.attachments.size > 0
                  ? m.content + m.attachments.first().proxyURL
                  : m.content
              }`
                    )
                    .reverse()
                    .join("\n");
                if (b.length < 1) b = "No messages sent";
                await this.client.paste
                    .createPaste({
                        code: `${b}`,
                        expireDate: "N",
                        publicity: 1,
                        name: `${message.channel.name}`,
                    })
                    .then(async () => {
                        let ticket = await tickets.findOne({
                            ticketId: message.channel.id,
                            guildId: message.guild.id,
                        });

                        await ticket.delete().catch((err) => {
                            console.log(err);
                        });

                        setTimeout(() => {
                            message.channel.delete();
                        }, 5000);
                    });
            });
        }

        if (message.customId === "reopen") {

            if (!message.member.permissions.has("MANAGE_GUILD")) {
                return message.reply('You must have \`MANAGE_GUILD\` permission or be alone in the voice channel to use this command!');
            }

            let ticket = await tickets.findOne({
                ticketId: message.channel.id,
                guildId: message.guild.id,
            });

            if (ticket.closed === false)
                return message.reply('This ticket is not closed!');

            let main = await message.channel.messages.fetch(ticket.mainMessageId);
            let user = await message.guild.members.fetch(ticket.ticketId);

            if (!user)
                return message.reply('I couldn\'t find the ticket owner!');

            ticket.closed = false;
            ticket.panelMessageId = undefined;

            await ticket.save();

            let row = new MessageActionRow().addComponents(
                new MessageButton()
                .setCustomId("close")
                .setLabel("Close ticket")
                .setStyle("SECONDARY")
                .setEmoji("🔒")
            );

            await main.edit({
                components: [row],
            });

            await message.channel.permissionOverwrites
                .edit(user.user.id, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                })
                .catch((err) => {
                    console.log(err);
                });

            message.message.delete();

            if (message.customId === "transcript") {

                if (!message.member.permissions.has("MANAGE_GUILD")) {
                    return message.reply('You must have \`MANAGE_GUILD\` permission or be alone in the voice channel to use this command!');
                }

                message.reply('Saving transcript...');

                message.channel.messages.fetch().then(async (messages) => {
                    let b = messages
                        .filter((m) => m.author.bot !== true)
                        .map(
                            (m) =>
                            `${new Date(m.createdTimestamp).toLocaleString("en-GB")} - ${
                m.author.username
              }#${m.author.discriminator}: ${
                m.attachments.size > 0
                  ? m.content + m.attachments.first().proxyURL
                  : m.content
              }`
                        )
                        .reverse()
                        .join("\n");
                    if (b.length < 1) b = "No messages sent";
                    await this.client.paste
                        .createPaste({
                            code: `${b}`,
                            expireDate: "N",
                            publicity: 1,
                            name: `${message.channel.name}`,
                        })
                        .then(async (res) => {
                            let urlToPaste = res;
                            let ticket = await tickets.findOne({
                                ticketId: message.channel.id,
                                guildId: message.guild.id,
                            });

                            let row = new MessageActionRow().addComponents(
                                new MessageButton()
                                .setLabel("View transcript")
                                .setURL(urlToPaste)
                                .setStyle("LINK")
                            );

                            await message.edit({
                                content: "Transcript saved!",
                                components: [row],
                            });

                            if (data.transcript_channel) {
                                let emb = new MessageEmbed()
                                    .setDescription(
                                        `📰 Transcript from the ticket \`${message.channel.id}\` Opened by <@!${ticket.ticketId}>`
                                    )
                                    .setColor(0x36393e)
                                    .setTimestamp();

                                let transcript = await message.guild.channels.fetch(
                                    data.transcript_channel
                                );
                                transcript.send({
                                    embeds: [emb],
                                    components: [row],
                                });
                            }

                        });
                });
            };
        }
    }
};