const { startCommandText } = require("../data/texts");
const { hasUser, saveUser } = require("../services/user-service");

const helpCommand = (bot, msg) => {
  bot.sendMessage(
    msg.chat.id,
    `📌 چطور ربات رو به کانال اضافه کنم؟

    خیلی ساده 👇  
    1. برو به صفحه پروفایل بات  
    2. گزینه "➕ Add to Group or Channel" رو بزن  
    3. کانالت رو انتخاب کن  
    4. مطمئن شو دسترسی ارسال پیام برام فعاله  
    5. ذخیره کن و برگرد اینجا ✅

    اگه اضافه کردی، حالا یک پیام از کانالت رو برای من فوروارد کن تا متوجه بشم.`
  );
};

const startCommand = (bot, msg) => {
  const user = msg.from;
  const { id: userId } = user;
  const isExistUser = hasUser(userId);

  if (!isExistUser) {
    bot.sendMessage(userId, startCommandText, {
      //   reply_markup: {
      //     inline_keyboard: [
      //       [
      //         {
      //           text: "🔗 اتصال به Spotify",
      //           url: "https://your-auth-link.com",
      //         },
      //       ],
      //     ],
      //   },
    });

    console.log({
      userId,
      TELEGRAM_BOT_OWNER_ID: process.env.TELEGRAM_BOT_OWNER_ID,
    });

    if (Number(userId) === Number(process.env.TELEGRAM_BOT_OWNER_ID)) {
      const mention = user.username ? `@${user.username}` : "(بدون یوزرنیم)";
      bot.sendMessage(
        process.env.TELEGRAM_BOT_OWNER_ID,
        `👤 کاربر جدید:\n${user.first_name} ${mention}\nID: ${user.id} \n به بات اضافه شد.`
      );
    }

    saveUser(userId, user);
  } else {
    bot.sendMessage(
      userId,
      `ᯤ Sypotify | سایپوتیفای
        سلام کصکش!`
    );
  }
};

const onText = (bot) => {
  bot.onText(/\/start/, (msg) => startCommand(bot, msg));
  bot.onText(/\/help/, (msg) => helpCommand(bot, msg));
};

module.exports = onText;
