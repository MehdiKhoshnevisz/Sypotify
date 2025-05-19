const { saveUser } = require("../services/user-service");
const {
  botIsAdminText,
  botIsNotAdminText,
  connectToSpotifyText,
} = require("../data/texts");
const { USER_STEPS } = require("../constants");
const { spotifyAuthURL } = require("../configs");

const myChatMember = async (bot, msg) => {
  const user = msg.from;
  const { id: userId } = user;
  const chatId = msg.chat.id;
  const newStatus = msg.new_chat_member.status;

  if (["administrator", "member"].includes(newStatus)) {
    try {
      const me = await bot.getMe();
      const admins = await bot.getChatAdministrators(chatId);

      const isAdmin = admins.some(
        (admin) =>
          admin.user.id.toString() === me.id.toString() &&
          ["administrator", "creator"].includes(admin.status)
      );

      if (!isAdmin) {
        await bot.sendMessage(userId, botIsNotAdminText);
        return;
      }

      await bot.sendMessage(userId, botIsAdminText, {
        reply_markup: {
          inline_keyboard: [
            [{ text: connectToSpotifyText, url: spotifyAuthURL(userId) }],
          ],
        },
      });

      console.log({ msg });

      saveUser(userId, {
        ...user,
        step: USER_STEPS.CHANNEL_VERIFIED,
        channel: {
          id: chatId,
          title: msg.forward_from_chat.title,
        },
      });
    } catch (err) {
      console.error("خطا در بررسی وضعیت ادمین:", err);
    }
  }
};

const onMyChatMember = (bot) => {
  bot.on("my_chat_member", async (msg) => myChatMember(bot, msg));
};

module.exports = onMyChatMember;
