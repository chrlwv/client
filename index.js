require('dotenv').config();

const Sentry = require("@sentry/node");

const Bot = require("./src/struct/Bot");
const client = new Bot();

Sentry.init({
  dsn: process.env.SENTRY,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

(async () => await client.start(process.env.TOKEN))();