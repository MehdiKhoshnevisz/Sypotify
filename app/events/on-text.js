const startCommand = (bot, msg) => {
  const userId = msg.from.id;
  //   const currentUser = users[userId] ? users[userId] : {};
  //   users[userId] = { ...currentUser, step: "start" };

  bot.sendMessage(
    userId,
    `ᯤ Sypotify | سایپوتیفای
    1. Add me to your channel as admin
    2. Forward any message from your channel here
    3. Connect Spotify account
    4. Select target playlist`
  );
};

const onText = (bot) => {
  bot.onText(/\/start/, (msg) => startCommand(bot, msg));
};

module.exports = onText;
