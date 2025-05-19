const axios = require("axios");
const path = require("path");
const bot = require("../bot");
const { spotify } = require("../configs");
const { USER_STEPS } = require("../constants");
const { getAuthHeaders } = require("../helpers");
const { getUser, saveUser } = require("../services/user-service");

const authSpotifyController = async (req, res) => {
  const { code, state: userId } = req.query;

  try {
    const tokenRes = await axios.post(
      process.env.SPOTIFY_TOKEN_API_URL,
      {
        code,
        grant_type: "authorization_code",
        client_id: spotify.CLIENT_ID,
        redirect_uri: spotify.REDIRECT_URI,
        client_secret: spotify.CLIENT_SECRET,
      },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token } = tokenRes?.data;

    const playlists = await axios.get(
      `${process.env.SPOTIFY_API_URL}/me/playlists`,
      { headers: getAuthHeaders(access_token) }
    );

    const keyboard = {
      inline_keyboard: playlists?.data?.items.map((p) => [
        { text: p.name, callback_data: `playlist:${p.id}` },
      ]),
    };

    bot.sendMessage(
      userId,
      "✅ به اسپوتیفای باموفقیت متصل شدی!\n حالا پلی‌لیستت رو انتخاب کن:",
      {
        reply_markup: keyboard,
      }
    );

    const user = getUser(userId);

    saveUser(userId, {
      ...user,
      step: USER_STEPS.SPOTIFY_CONNECTED,
      spotify: {
        accessToken: access_token,
        refreshToken: refresh_token,
      },
    });

    res.sendFile(path.join(__dirname, "../views/success.html"));
  } catch (err) {
    // bot.sendMessage(
    //   userId,
    //   "❌ Spotify connection failed. Please try /start again."
    // );
    console.error("OAuth error:", err);
    res.send("Authentication failed. Please try again.");
  }
};

module.exports = authSpotifyController;
