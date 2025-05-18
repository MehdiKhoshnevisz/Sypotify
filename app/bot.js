const TelegramBot = require("node-telegram-bot-api");
const onText = require("./events/on-text");
const onPollingError = require("./events/polling-error");
const onMyChatMember = require("./events/my-chat-member");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Load events
onText(bot);
onPollingError(bot);
onMyChatMember(bot);

module.exports = bot;
