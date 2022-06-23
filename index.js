require('dotenv').config();

const Bot = require('./src/struct/Bot');
const client = new Bot();

(async () => await client.start(process.env.TOKEN))();