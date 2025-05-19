const { USER_STEPS } = require("../constants");
const { startCommandText, helpCommandText } = require("../data/texts");
const { hasUser, saveUser } = require("../services/user-service");

const helpCommand = (bot, msg) => {
  bot.sendMessage(msg.chat.id, helpCommandText);
};

const startCommand = (bot, msg) => {
  const user = msg.from;
  const { id: userId } = user;
  const isExistUser = hasUser(userId);

  bot.sendMessage(userId, startCommandText);

  if (!isExistUser) {
    if (Number(userId) === Number(process.env.TELEGRAM_BOT_OWNER_ID)) {
      const mention = user.username ? `@${user.username}` : "(بدون یوزرنیم)";
      bot.sendMessage(
        process.env.TELEGRAM_BOT_OWNER_ID,
        `👤 کاربر جدید:\n${user.first_name} ${mention}\nID: ${user.id} \n به بات اضافه شد.`
      );
    }

    saveUser(userId, { ...user, step: USER_STEPS.START });
  }
};

const onText = (bot) => {
  bot.onText(/\/start/, (msg) => startCommand(bot, msg));
  bot.onText(/\/help/, (msg) => helpCommand(bot, msg));
};

module.exports = onText;
