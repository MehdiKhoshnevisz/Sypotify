const axios = require("axios");
const { getAuthHeaders } = require("../helpers");
const { getUser, saveUser } = require("../services/user-service");

const playlistCallback = async (bot, { query, userId, playlistId }) => {
  try {
    const user = getUser(userId);
    if (!user?.spotify?.accessToken) throw new Error("Spotify not connected");

    const playlists = await axios.get(
      `${process.env.SPOTIFY_API_URL}/playlists/${playlistId}`,
      { headers: getAuthHeaders(user.spotify.accessToken) }
    );

    saveUser(userId, {
      ...user,
      playlist: {
        id: playlistId,
        name: playlists.data.name,
      },
    });

    await bot.answerCallbackQuery(query.id, {
      text: `پلی‌لیست انتخابی: ${playlists.data.name}`,
    });

    bot.sendMessage(
      userId,
      `✅ پلی‌لیست با موفقیت انتخاب شد \n موزیکات به پلی لیست "${playlists.data.name}" اضافه‌ می‌شن. \n\n حالا می‌تونی موزیکات رو اضافه کنی...`
    );
  } catch (err) {
    console.error("Playlist selection error:", err);
    await bot.answerCallbackQuery(query.id, { text: "خطا در انتخاب پلی‌لیست" });
    bot.sendMessage(userId, "❌ خطایی رخ داده. دوباره تلاش کن /start");
  }
};

const onCallbackQuery = (bot) => {
  bot.on("callback_query", (query) => {
    const userId = query.from.id;
    const data = query.data;
    const dataKey = data.split(":")[0];
    const dataValue = data.split(":")[1];

    switch (dataKey) {
      case "playlist":
        playlistCallback(bot, { query, userId, playlistId: dataValue });
        break;
    }
  });
};

module.exports = onCallbackQuery;
