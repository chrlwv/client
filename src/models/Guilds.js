/** @format */

const { Schema, model } = require("mongoose");

module.exports = model(
  "Guilds",
  new Schema({
    guildId: { type: String },
    prefix: { type: String, default: "/" },
    level_msg_module: { type: Boolean, default: true },
    uri_blocker_module: { type: Boolean, default: false },
    auto_role_module: { type: String, default: null },
    welcome_event_module: { type: String, default: null },
    leave_event_module: { type: String, default: null },
    client_logging: {
      enable: { type: Boolean, default: true },
      channel: { type: String, default: null },
      case: { type: Number, default: 1 },
    },
  })
);
