const { spotifyAuthURL } = require("../configs");
const { USER_STEPS } = require("../constants");
const {
  startCommandText,
  aboutCommandText,
  connectToSpotifyText,
} = require("../data/texts");
const { hasUser, saveUser, getUser } = require("../services/user-service");

const aboutCommand = (bot, msg) => {
  bot.sendMessage(msg.chat.id, aboutCommandText);
};

const statusCommand = (bot, msg) => {
  const user = msg.from;
  const { id: userId } = user;
  const isExistUser = hasUser(userId);

  if (isExistUser) {
    const currentUser = getUser(userId);

    bot.sendMessage(
      userId,
      `${
        currentUser?.channel?.id
          ? `✅ بات در کانال ${currentUser?.channel?.title} ادمین هست.`
          : "❌ بات به عنوان ادمین در کانال هنوز اضافه نشده!"
      }\n\n${
        currentUser?.spotify?.accessToken
          ? "✅ به اسپاتیفای وصل هستی."
          : "❌ به اسپاتیفای هنوز وصل نشدی!"
      }\n\n${
        currentUser?.playlist?.id
          ? `🎧 پلی‌لیست انتخابی: ${currentUser?.playlist?.name}`
          : ""
      }`,
      {
        reply_markup: {
          inline_keyboard: [
            !currentUser?.channel?.id
              ? [
                  {
                    text: "افزودن بات به کانال",
                    url: "https://t.me/share/url?url=https://t.me/sypotify_bot",
                  },
                ]
              : [],
            !currentUser?.spotify?.accessToken
              ? [{ text: connectToSpotifyText, url: spotifyAuthURL(userId) }]
              : [],
          ],
        },
      }
    );
  }
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
  bot.onText(/\/status/, (msg) => statusCommand(bot, msg));
  bot.onText(/\/about/, (msg) => aboutCommand(bot, msg));
};

module.exports = onText;
