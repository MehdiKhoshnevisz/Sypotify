const { default: axios } = require("axios");
const { USER_STEPS } = require("../constants");
const eventBus = require("../events/event-bus");

eventBus.on(USER_STEPS.SPOTIFY_CONNECTED, async (userId) => {
  const playlists = await axios.get(
    `${process.env.SPOTIFY_API_URL}/me/playlists`,
    { headers: getAuthHeaders(access_token) }
  );

  const keyboard = {
    inline_keyboard: playlists?.data?.items.map((p) => [
      { text: p.name, callback_data: `playlist=${p.id}` },
    ]),
  };

  bot.sendMessage(userId, "انتخاب پلی‌لیست:", {
    reply_markup: keyboard,
  });
});
