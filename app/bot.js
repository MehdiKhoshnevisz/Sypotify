const TelegramBot = require("node-telegram-bot-api");
const onText = require("./bot-events/on-text");
const onPollingError = require("./bot-events/polling-error");
const onMyChatMember = require("./bot-events/my-chat-member");
const onCallbackQuery = require("./bot-events/callback-query");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Load events
onText(bot);
onPollingError(bot);
onMyChatMember(bot);
onCallbackQuery(bot);

module.exports = bot;
