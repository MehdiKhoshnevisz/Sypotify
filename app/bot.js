const TelegramBot = require("node-telegram-bot-api");
const onText = require("./events/on-text");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Load events
onText(bot);

module.exports = bot;
