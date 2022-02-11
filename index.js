require('dotenv').config();

const Bot = require('./src/struct/Bot');
const client = new Bot();

const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY,
  tracesSampleRate: 1.0,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

(async () => await client.start(process.env.TOKEN))();